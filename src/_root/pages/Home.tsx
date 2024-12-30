import { useSelector } from 'react-redux'
import { MusicList } from '../../components'
import { Carusel } from '../../components/shared'
import { useMainContext } from '../../contexts/MainContext'
import { useUserContext } from '../../contexts/AuthContext/AuthContext'
import { useGetAlbums, useGetMusics } from '../../lib/react-query/queris'
import { RootState } from '../../redux/store'
import { useEffect, useState } from 'react'
import { appwriteConfig, client } from '../../lib/AppWrite/config'
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Home() {
  const { openNotification ,searchWord} = useMainContext()
  const { checkAuthUser , user} = useUserContext()
  const { isPlaying, activeSong, currentIndex } = useSelector((state: RootState) => state?.player);
  const { data: getMusics } = useGetMusics()
  const { mutateAsync: getAlbums } = useGetAlbums()
  const [musics, setMusics] = useState()
  const [albums, setAlbums] = useState()
  useEffect(() => {
    getMusicsFunc(searchWord)
    getAlbumsFunc()
    user && checkAuthUser()
    const unSubscribeMusicCol = client.subscribe([`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.musicsCollectionId}.documents`,`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.savesCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.albumsCollectionId}.documents`, `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.userCollectionId}.documents`], () => {
      getMusicsFunc(searchWord)
      getAlbumsFunc()
      user && checkAuthUser()
    });
    return () => {
      unSubscribeMusicCol()
    }
  }, [user])
  useEffect(()=>{
    getMusicsFunc(searchWord)
  },[searchWord,getMusics?.data])

  const getMusicsFunc = async (searchWord:any) => {
    try {
      let musicsRes=getMusics?.data?.filter((music:any)=>music?.title?.toLowerCase().includes
      (searchWord?.toLowerCase()) && music)
      searchWord ? setMusics(musicsRes) : setMusics(getMusics?.data)
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const getAlbumsFunc = async () => {
    try {
      const getAlbumsRes = await getAlbums()
      if (getAlbumsRes.error) {
        throw new Error(getAlbumsRes.error)
      }
      setAlbums(getAlbumsRes?.data?.documents)
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  return (
    <div className={`w-full min-h-[100vh] mt-[3.5rem] pb-[5rem] sm:px-6 dark:bg-[var(--dark-bg-blue)]`}>
      <Carusel />
      <MusicList
        user={user}
        song={{ isPlaying, activeSong, currentIndex }}
        musics={musics}
        albums={albums}
        admin={false}
      />
    </div>
  )
}
