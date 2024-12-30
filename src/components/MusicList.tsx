import { Col, Flex, Row } from "antd";
import { AddAlbumModal, AddMusicModal, MusicCard, MusicFilter } from "./shared";
import { memo, useEffect, useState } from "react";
import { useCreateMusic, useCreateSaveMusic,  useCreateViewMusic,  useDelColDoc, useGetFilterMusic,useSaveMusic, useUpdateUser, useViewedMusic } from "../lib/react-query/queris";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { IActiveSong, IUser } from "../types";
import { FilterMusicsList } from ".";
import { IoMdAddCircleOutline } from "react-icons/io";
import { appwriteConfig } from "../lib/AppWrite/config";
import { useMainContext } from "../contexts/MainContext";
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';


function MusicList({ user:oldUser, song ,musics,albums,admin}: { user: any, song: { isPlaying: boolean, activeSong: IActiveSong, currentIndex: number }, musics:any,albums?:any,admin?:boolean}) {    
    const [filterMusic, setFilterMusic] = useState<[]>()
    const [showMenu, setShowMenu] = useState("music")
    const [isModalOpen, setIsModalOpen] = useState<{ title: string, target: boolean }>();
    const [selectedAlbum, seSelectedAlbum] = useState<any>()
    const [user,setUser]=useState<IUser>()
    const { data: getFilterMusic } = useGetFilterMusic()
    const { mutateAsync: updateUser } = useUpdateUser()
    const { mutateAsync: createMusic } = useCreateMusic()
    const { mutateAsync: delColDoc } = useDelColDoc()
    const { mutateAsync: createSaveMusic } = useCreateSaveMusic()
    const { mutateAsync: saveMusic } = useSaveMusic()
    const { mutateAsync: createViewMusic } = useCreateViewMusic()
    const { mutateAsync: viewedMusic } = useViewedMusic()
    const [ isMusicLoading,setIsMusicLoading]=useState<boolean>(false)
    const { openNotification} = useMainContext()
    useEffect(()=>{
        setUser(oldUser)
    },[oldUser])
    useEffect(() => {
        if (getFilterMusic) {
            const newfilterMusic: any = []
            getFilterMusic?.data?.map((menu: any) => {
                newfilterMusic.push({ ...menu, scroll: { to: `filterMusic_${menu?.title}` }, onClicFunc: () => { setShowMenu("music") } })
            })
            newfilterMusic.push({ id: "12", title: "Albums", onClicFunc: () => { setShowMenu("albums") } })
            setFilterMusic(newfilterMusic)
        }
    }, [getFilterMusic])

    const toggleModal = (title: string, target: boolean) => {
        setIsModalOpen({ title, target });
    };
    

    const addMusicSubmitFunc = async ({ title, singer, image_url, music_url }: { title: string, singer: string, image_url: any, music_url: any }) => {
        if(!user){
            throw new Error("register first")
          }
        const newMusic = await createMusic({
            creator: user?.$id,
            title,
            singer,
            image_url,
            music_url,
            albums: selectedAlbum?.$id && showMenu === "albums/musics" ? [selectedAlbum?.$id] : null
        })
        return newMusic
    }
    const delMusicFunc = async (doccumentId: string) => {
        try {
            if(!user){
                throw new Error("register first")
              }
            else if(doccumentId){
                const delColDocRes = await delColDoc({ collectionId: appwriteConfig.musicsCollectionId, doccumentId })
                if (delColDocRes?.error) {
                    throw new Error(delColDocRes.error)
                }
                openNotification({ placement: 'topLeft', description: "music has been removed", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
            }
        }
        catch (error) {
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    const delAlbumFunc = async (doccumentId: string) => {
        try {
            if(!user){
                throw new Error("register first")
              }
            const delColDocRes = await delColDoc({ collectionId: appwriteConfig.albumsCollectionId, doccumentId })
            if (delColDocRes?.error) {
                throw new Error(delColDocRes.error)
            }
            openNotification({ placement: 'topLeft', description: "album has been removed", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
        catch (error) {
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
        }
    }
    const likeMusicFunc = async (music: any) => {
        try {
            if(!user){
                throw new Error("register first")
              }
            const {liked_musics}=user
            let newLikes=[]
            let likes=[]
            let availableUser=false
            if(liked_musics?.length===0){
                newLikes.push(music?.$id)
                likes.push(music)
            }
            else{
                liked_musics?.forEach((like:any)=> {
                    if(like?.$id !== music?.$id){
                        newLikes.push(like?.$id)
                        likes.push(like)
                    }
                    else{
                        availableUser=true
                    }
                })
                if(!availableUser){
                    newLikes.push(music?.$id)
                    likes.push(music)
                }
            }
            setUser({...user,liked_musics: likes})
          const updateMusic = await updateUser({ user, liked_musics: newLikes })
          if (updateMusic.error) {
            throw new Error(updateMusic.error)
          }
        }
        catch (error) {
          openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
        }
      }
    const saveMusicFunc=async (music:any)=>{        
        try{
            setIsMusicLoading(true)
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
        finally{
            setIsMusicLoading(false)
        }
    }
    const viewMusicFunc=async (music:any)=>{        
        try{
            setIsMusicLoading(true)
            if(user){
                let viewsId=user?.views?.$id
                if(!user?.views){
                    const createViewMusicRes=await createViewMusic({userId:user?.$id})
                    if(createViewMusicRes.error){
                        throw new Error(createViewMusicRes.error)
                    }
                    viewsId=createViewMusicRes?.data?.$id
                    
                }
                let newViews=[]
                let availableMusic=false
                
                if(user?.views?.musics?.length===0){
                    newViews.push(music)
                }
                else{
                    user?.views?.musics?.forEach((viewedMusic:any)=> {
                        if(viewedMusic?.$id!==music?.$id){
                            newViews.push(viewedMusic)
                        }
                        else{
                            availableMusic=true
                        }
                        !availableMusic && newViews.push(music)
                    })
                }
                if(!availableMusic){
                    const viewsMusicRes=await viewedMusic({musics:newViews,viewId:viewsId})
                    if(viewsMusicRes.error){
                        throw new Error(viewsMusicRes.error)
                    }
                }
            }
        }
        finally{
            setIsMusicLoading(false)
        }
    }
    return (
        <Col className="pb-[5rem] px-6">
            <Row className="flex-col sm:flex-row items-center justify-center sm:justify-between">
                <MusicFilter data={filterMusic} />
            </Row>
            {
                showMenu === "music" ?
                    <FilterMusicsList user={user}  admin={admin} filterMusics={getFilterMusic?.data} musics={musics} playPause={playPause} song={{activeSong:song.activeSong,isPlaying:song.isPlaying,currentIndex:song.currentIndex}}  setActiveSong={setActiveSong}
                        isMusicLoading={isMusicLoading}
                        addButton={{ onclick: () => toggleModal("music", true), title: "add", body: "music" }}
                        delMusicFunc={delMusicFunc}
                        likeMusicFunc={likeMusicFunc}
                        saveMusicFunc={saveMusicFunc}
                        viewMusicFunc={viewMusicFunc}
                    />
                    :
                    showMenu === "albums" ?
                        <Col className="gap-4 mt-2">
                            <Col className=" font-semibold text-xl text-[var(--color-gray)]">Albums</Col>
                            <Row className=" gap-4 justify-center">
                                {admin&&<Col
                                    className="gap-2"
                                >
                                    <Flex className="justify-center items-center">
                                        <Col
                                            className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                                            onClick={() => toggleModal("album", true)}
                                        >
                                            <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]' />
                                        </Col>
                                    </Flex>
                                    <Col>
                                        <div className=" text-xl font-semibold text-center dark:text-gray-200">add</div>
                                        <div className=" text-sm text-center dark:text-gray-500">album</div>
                                    </Col>
                                </Col>}
                                {
                                    albums?.map((album: any, albumIndex: number) => (
                                        <MusicCard key={albumIndex} admin={admin} music={album} musicIndex={albumIndex} parentIdx={23} 
                                        deleteItemFunc={delAlbumFunc} 
                                        likeMusicFunc={likeMusicFunc}
                                        saveMusicFunc={saveMusicFunc}
                                        viewMusicFunc={viewMusicFunc}
                                            event={{
                                                onClick: () => {
                                                    setShowMenu("albums/musics")
                                                    seSelectedAlbum(album)
                                                }
                                            }} />
                                    ))
                                }
                            </Row>
                        </Col>
                        :
                    showMenu === "albums/musics" ?
                        <FilterMusicsList user={user} admin={admin} filterMusics={getFilterMusic?.data} musics={selectedAlbum?.musics} playPause={playPause} song={{activeSong:song.activeSong,isPlaying:song.isPlaying,currentIndex:song.currentIndex}} setActiveSong={setActiveSong}
                            addButton={{ onclick: () => toggleModal("music", true), title: "add", body: "music" }}
                            isMusicLoading={isMusicLoading}
                            delMusicFunc={delMusicFunc}
                            likeMusicFunc={likeMusicFunc}
                            saveMusicFunc={saveMusicFunc}
                            viewMusicFunc={viewMusicFunc}
                        />
                        : ""
            }
            <AddMusicModal isModalOpen={isModalOpen} toggleModal={toggleModal} submitFunc={addMusicSubmitFunc} />
            <AddAlbumModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
        </Col>
    )
}
export default memo(MusicList)