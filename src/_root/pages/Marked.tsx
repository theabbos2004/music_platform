import { useSelector } from "react-redux";
import { useMainContext } from "../../contexts/MainContext";
import { useCreateSaveMusic, usegetCurrentUserQuery, useSaveMusic } from "../../lib/react-query/queris";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { appwriteConfig, client } from "../../lib/AppWrite/config";
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { SavedComp } from "../../components";
import { useUserContext } from "../../contexts/AuthContext/AuthContext";
import { IUser } from "../../types";

export default function Marked() {
 const { openNotification } = useMainContext()
  const { checkAuthUser} = useUserContext()
  const { data: currentUser } = usegetCurrentUserQuery()
  const { mutateAsync: createSaveMusic } = useCreateSaveMusic()
  const { mutateAsync: saveMusic } = useSaveMusic()
  const [user, setUser] = useState<IUser>()
  const { isPlaying, activeSong, currentIndex } = useSelector((state: RootState) => state?.player);
  useEffect(() => {
    if (currentUser?.data) {
      getUser()
      const unSubscribeMusicCol = client.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.savesCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsCollectionId}.documents`], () => {
        getUser()
      });
      return () => {
        unSubscribeMusicCol()
      }
    }
  }, [currentUser])
  const getUser=async ()=>{
    try{
      const checkAuthUserRes=await checkAuthUser()
      if(checkAuthUserRes?.error){
        throw new Error(checkAuthUserRes?.error)
      }
      setUser(checkAuthUserRes.data);
    }
    catch(error){
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
    }
  }
  const saveMusicFunc=async (music:any)=>{        
    try{
        if(!user){
            throw new Error("please register first")
        }
        let saveId=user?.saves?.$id
        if(!user?.saves){
            const createSaveMusicRes=await createSaveMusic({userId:user?.$id})
            if(createSaveMusicRes.error){
                throw new Error(createSaveMusicRes.error)
            }
            saveId=createSaveMusicRes?.data?.$id
            
        }
        
        let newSaves=[]
        let saves=[]
        let availableUser=false
        if(user?.saves?.musics?.length===0){
            newSaves.push(music?.$id)
            saves.push(music)
        }
        else{
            user?.saves?.musics?.forEach((save:any)=> {
                if(save?.$id!==music?.$id){
                    newSaves.push(save.$id)
                    saves.push(save)
                }
                else{
                    availableUser=true
                }
            })
            if(!availableUser){
                newSaves.push(music.$id)
                saves.push(music)
            }
        }
        setUser({...user,saves:{...user?.saves,musics:saves}})
        const saveMusicRes=await saveMusic({musics:newSaves,saveId})
        if(saveMusicRes.error){
            throw new Error(saveMusicRes.error)
        }
        availableUser?
        openNotification({ placement: 'topLeft', description: `music has been remove in save`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
        :openNotification({ placement: 'topLeft', description: `it was successful`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch(error){
        openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
    }
  }
  return (
    <section className="min-h-[100vh] mt-[3.5rem] p-4 dark:bg-[var(--dark-bg-blue)] dark:text-white">
      <SavedComp user={user} currentUser={currentUser?.data} musics={user?.saves?.musics} song={{ isPlaying, activeSong, currentIndex }} saveMusicFunc={saveMusicFunc} />
    </section>
  )
}
