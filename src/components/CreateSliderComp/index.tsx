import { AddAdvertisingModal, AddMusicAdvertisingModal, MusicCard } from '../shared'
import { IActiveSong } from '../../types'
import { Col, Flex, Row, Skeleton, Space } from 'antd'
import { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useActiveAdvertising, useAddMusicToAdvertising, useDelAdvertising, useGetAdvertising } from '../../lib/react-query/queris';
import { useMainContext } from '../../contexts/MainContext';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function CreateSliderComp({ user, song }: { user: any, song: { isPlaying: boolean, activeSong: IActiveSong, currentIndex: number } }) {
  const { mutateAsync: delAdvertising } = useDelAdvertising()
  const { data: getAdvertising } = useGetAdvertising()
  const { mutateAsync: activeAdvertising } = useActiveAdvertising()
  const { mutateAsync: addMusicToAdvertising } = useAddMusicToAdvertising()
  const [showMenu, setShowMenu] = useState("advertising")
  const [isModalOpen, setIsModalOpen] = useState<{ title: string, target: boolean }>();
  const [selectedAdvertising, setSelectedAdvertising] = useState<any>()
  const [musics, setMusics] = useState<any>()
  const { openNotification } = useMainContext()

  useEffect(() => {
    const newMusics = user?.advertisings?.filter((advertising: any) => advertising?.$id === selectedAdvertising?.$id)[0]?.musics
    setMusics(newMusics)
  }, [user, selectedAdvertising])

  const toggleModal = (title: string, target: boolean) => {
    setIsModalOpen({ title, target });
  };

  const deleteAdvertisingFunc = async (advertisingId: any) => {
    try {
      const delColDocRes = await delAdvertising({ advertisingId })
      if (delColDocRes?.error) {
        throw new Error(delColDocRes.error)
      }
      openNotification({ placement: 'topLeft', description: "music has been removed", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const activeAdvertisingFunc = async (advertising: any) => {
    try {
        getAdvertising?.data?.documents?.map((oldAdvertising:{$id?:string,show:null|boolean})=>{
          if(oldAdvertising?.$id === advertising?.$id){
            activeAdvertising({ advertising ,show:true})
          }
          else if(oldAdvertising?.show){
            activeAdvertising({ advertising:oldAdvertising, show:false})
          }
        })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  const deleteAdvertisingMusicFunc = async (musicId: string) => {
    try {
      const musicList = selectedAdvertising?.musics?.filter((AdgMusic: any) =>AdgMusic?.$id !== musicId  && AdgMusic)
      const newMusic = await addMusicToAdvertising({ advertisingId: selectedAdvertising?.$id, musicList })
      if (newMusic.error) {
        throw new Error(newMusic.error)
      }
      openNotification({ placement: 'topLeft', description: "music has been removed", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
    catch (error) {
      openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-green)" }} /> })
    }
  }
  return (
    <Flex wrap className="w-full justify-center" gap="middle">
      {
        showMenu === "advertising" ?
          <Col className="flex flex-col gap-5">
            <Col className=" font-semibold text-center text-xl text-[var(--color-gray)] dark:text-gray-100">Advertisings</Col>
            <Row className="gap-4 justify-center">
                <Col
                    className="gap-2"
                  >
                    <Flex className="justify-center items-center">
                      <Col
                        className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                        onClick={() => toggleModal("advertising", true)}
                      >
                        <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]' />
                      </Col>
                    </Flex>
                    <Col>
                      <div className=" text-xl font-semibold text-center">add</div>
                      <div className=" text-sm text-center">advertising</div>
                    </Col>
                </Col>
              {
                user?.advertisings?.length > 0
                  ? (user?.advertisings?.map((advertising: any, advertisingIndex: number) => (
                    <MusicCard key={advertisingIndex} admin={true} music={advertising} musicIndex={advertisingIndex} parentIdx={23}
                      deleteItemFunc={deleteAdvertisingFunc}
                      activeAdvertisingFunc={activeAdvertisingFunc}
                      event={{
                        onClick: () => {
                          setShowMenu("advertisings/musics")
                          setSelectedAdvertising(advertising)
                        }
                      }} />
                  )))
                  : !user?.advertisings ?
                    Array.from({ length: 4 }).map((_, index) => (
                      <Space key={index} className=' flex flex-col'>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "8rem", borderRadius: "1rem" }}><></></Skeleton.Node>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "1.2rem" }}><></></Skeleton.Node>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "0.8rem" }}><></></Skeleton.Node>
                      </Space>
                    ))
                    : ""
              }
            </Row>
          </Col>
          :
          showMenu === 'advertisings/musics' ?
            <Col className="flex flex-col gap-5">
              <Col className=" font-semibold text-center text-xl text-[var(--color-gray) dark:text-gray-100">Advertisings's musics</Col>
              <Row className="gap-4 justify-center">
                <Col
                  className="gap-2"
                >
                  <Flex className="justify-center items-center">
                    <Col
                      className={`w-32 h-32 rounded-2xl bg-cover bg-no-repeat bg-center flex justify-center items-center bg-[var(--color-blue-1)] cursor-pointer`}
                      onClick={() => toggleModal("musicToAdvertising", true)}
                    >
                      <IoMdAddCircleOutline className='size-12 text-[var(--color-gray)]' />
                    </Col>
                  </Flex>
                  <Col>
                    <div className=" text-xl font-semibold text-center">add</div>
                    <div className=" text-sm text-center">music to advertising</div>
                  </Col>
                </Col>
                {
                  musics?.length > 0 
                  ? (musics?.map((music: any, musicIndex: number) => (
                    <MusicCard key={musicIndex} admin={true} music={music} musics={musics} musicIndex={musicIndex} parentIdx={24}
                      song={song} user={user}
                      deleteItemFunc={deleteAdvertisingMusicFunc}
                    />
                  )))
                  :!musics ?
                    Array.from({ length: 4 }).map((_, index) => (
                      <Space key={index} className=' flex flex-col'>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "8rem", borderRadius: "1rem" }}><></></Skeleton.Node>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "1.2rem" }}><></></Skeleton.Node>
                        <Skeleton.Node active={true} style={{ width: "8rem", height: "0.8rem" }}><></></Skeleton.Node>
                      </Space>
                    ))
                    : ""
                }
              </Row>
            </Col>
            : ''
      }
      <AddAdvertisingModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      <AddMusicAdvertisingModal isModalOpen={isModalOpen} toggleModal={toggleModal} selectedAdvertising={selectedAdvertising} />
    </Flex>
  )
}
