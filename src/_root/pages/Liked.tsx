import { useEffect, useState } from "react";
import { LikedComp } from "../../components";
import { appwriteConfig, client } from "../../lib/AppWrite/config";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useMainContext } from "../../contexts/MainContext";
import { usegetCurrentUserQuery, useUpdateUser } from "../../lib/react-query/queris";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IUser } from "../../types";
import { useUserContext } from "../../contexts/AuthContext/AuthContext";


export default function Liked() {
  const { openNotification } = useMainContext()
  const { checkAuthUser} = useUserContext()
  const { data: currentUser } = usegetCurrentUserQuery()
  const { mutateAsync: updateUser } = useUpdateUser()
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
  const likeMusicFunc = async (music: any) => {
    try {
      if (!user) {
        throw new Error("register first")
      }
      const { liked_musics } = user
      let newLikes = []
      let likes = []
      let availableUser = false
      if (liked_musics?.length === 0) {
        newLikes.push(music?.$id)
        likes.push(music)
      }
      else {
        liked_musics?.forEach((like: any) => {
          if (like?.$id !== music?.$id) {
            newLikes.push(like?.$id)
            likes.push(like)
          }
          else {
            availableUser = true
          }
        })
        if (!availableUser) {
          newLikes.push(music?.$id)
          likes.push(music)
        }
      }
      setUser({ ...user, liked_musics: likes })
      const updateMusic = await updateUser({ user, liked_musics: newLikes })
      if (updateMusic.error) {
        throw new Error(updateMusic.error)
      }
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
    }
  }
  return (
    <section className="min-h-[100vh] mt-[3.5rem] p-4 dark:bg-[var(--dark-bg-blue)] dark:text-white">
      <LikedComp user={user} musics={user?.liked_musics} song={{ isPlaying, activeSong, currentIndex }} likeMusicFunc={likeMusicFunc} />
    </section>
  )
}
