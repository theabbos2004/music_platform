import { Form} from "antd";
import { useGetUser } from "../../lib/react-query/queris";
import { MusicList, ProfileInfo } from "../../components";
import { memo, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { useMainContext } from "../../contexts/MainContext";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { appwriteConfig, client } from "../../lib/AppWrite/config";
import { IUser } from "../../types";

function  Profile() {
    const { openNotification,searchWord} = useMainContext()
    const {mutateAsync:getUser}=useGetUser()
    const { isPlaying , activeSong , currentIndex} = useSelector((state:RootState) => state?.player);
    const [user,setUser]=useState<IUser>()
    const [musics, setMusics] = useState<any[]>()
    const pathUrl=useParams()
    useEffect(()=>{
        getUserFunc()
        getMusicsFunc(searchWord)
        const unSubscribeMusicCol=client.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.savesCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.albumsCollectionId}.documents`], () => {
            getUserFunc()
            getMusicsFunc(searchWord)
        });
        return ()=>{
            unSubscribeMusicCol()
        }
    },[])
    useEffect(()=>{
        getMusicsFunc(searchWord)
      },[searchWord,user])
    const getUserFunc=async ()=>{
        try{
            const getUserRes=await getUser({userId:`${pathUrl.id}`})
            if(getUserRes.error){
                throw new Error(getUserRes.error)
            }
            setUser(getUserRes?.data)
        }
        catch(error){
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    const getMusicsFunc = async (searchWord:string) => {
        try {
          let musicsRes=user?.musics_list?.filter((music:any)=>music?.title?.toLowerCase().includes
          (searchWord?.toLowerCase()) && music)
          searchWord ? setMusics(musicsRes) : setMusics(user?.musics_list)
        }
        catch (error) {
          openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
      }
    return (
        <Form className="min-h-[100vh] dark:bg-[var(--dark-bg-blue)]">
            <ProfileInfo user={user}/>
            <MusicList
                user={user}
                song={{isPlaying,activeSong,currentIndex}}
                musics={musics}
                albums={user?.albums}
                admin={true}
                />     
        </Form>
    )
}
export default  memo(Profile)