import { Button, Card, Col, ConfigProvider, Flex, Modal } from 'antd';
import { useMainContext } from '../../contexts/MainContext';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useAddMusicToAdvertising, usegetCurrentAccountQuery, useGetMusics } from '../../lib/react-query/queris';
import Search from 'antd/es/input/Search';

export default function AddMusicAdvertisingModal({ isModalOpen, toggleModal, selectedAdvertising }: { isModalOpen: any, toggleModal: any, selectedAdvertising: any }) {
    const { openNotification,theme } = useMainContext()
    const [isLoading, setIsLoading] = useState<boolean>()
    const [musics, setMusics] = useState<any>()
    const [selectMusics, setSelectMusics] = useState<any>()
    const [search, setSearch] = useState<any>("")
    const { mutateAsync: addMusicToAdvertising } = useAddMusicToAdvertising()
    const { data: getMusics } = useGetMusics()
    const { data: currentUser } = usegetCurrentAccountQuery()
    const modalStyles = {
        content:{
            backgroundColor:`${theme==="dark"&&"var(--color-blue-1)"}`,
        },
        header: {
            display: "flex",
            justifyContent: "center",
            backgroundColor:"transparent",
        },
        body: {
        },
        mask: {
            backdropFilter: 'blur(10px)',
        },
    };
    const submit = async () => {
        setIsLoading(true)
        try {
            let newAdvertisings = []

            let availableUser = false
            if (selectedAdvertising.musics.length === 0) {
                newAdvertisings.push(selectMusics?.$id)
            }
            else {
                selectedAdvertising.musics.forEach((music: any) => {
                    if (music?.$id !== selectMusics?.$id) {
                        newAdvertisings.push(music)
                    }
                    else {
                        availableUser = true
                    }
                })
                !availableUser && newAdvertisings.push(selectMusics?.$id)
            }
            if (availableUser) {
                throw new Error("this music is available")
            }
            const newMusic = await addMusicToAdvertising({ advertisingId: selectedAdvertising?.$id, musicList: newAdvertisings })
            if (newMusic.error) {
                throw new Error(newMusic.error)
            }
            openNotification({ placement: 'topLeft', description: "new music has added", icon: <CheckCircleOutlined style={{ color: "var(--color-green)" }} /> })
            setSearch("")
            toggleModal({ title: "musicToAdvertising", target: false })
            setSelectMusics(null)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            toggleModal({ title: "musicToAdvertising", target: false })
            openNotification({ placement: 'topLeft', description: `${error}`, icon: <ExclamationCircleOutlined style={{ color: "var(--color-red)" }} /> })
        }
    }

    useEffect(() => {
        getMusicsFunc()
    }, [currentUser,getMusics])

    const getMusicsFunc = async () => {
        setMusics(getMusics?.data)
    }
    return (
        <ConfigProvider
            modal={{
                styles: modalStyles,
            }}
        >
            <Modal
                title="Add advertising"
                open={isModalOpen?.title === "musicToAdvertising" && isModalOpen?.target}
                onOk={() => toggleModal({ title: "musicToAdvertising", target: false })}
                onCancel={() => toggleModal({ title: "musicToAdvertising", target: false })}
                footer={null}
                width={300}
            >
                <Search
                    placeholder="input search text"
                    allowClear
                    size="large"
                    onChange={(value) => setSearch(value.target.value)}
                    style={{ borderRadius: "30rem" }}
                />
                <Col className='py-2 mt-2 flex flex-col gap-4 h-max-[15rem] overflow-y-auto'>
                    {
                        musics?.filter((music: any) => music?.title?.toLowerCase().includes(search?.toLowerCase()) && music).slice(0,4)
                            .map((music: any, musicIndex: number) =>
                                <Card key={musicIndex} onClick={() => setSelectMusics(music)} className={`${selectMusics?.title === music.title ? "bg-gray-400" : "bg-gray-200"}`} 
                                bodyStyle={{ padding: "0.5rem" ,cursor:"pointer"}}>
                                    <Flex className='w-full gap-5 items-center'>
                                        <img src={music?.image_url} alt='picture' className=' size-10 rounded-xl object-cover object-center' />
                                        <Col>
                                            <div>{music?.title}</div>
                                            <div>{music?.singer}</div>
                                        </Col>
                                    </Flex>
                                </Card>
                            )
                    }
                </Col>
                <Button type="primary" className='w-full p-4 rounded-xl' htmlType="submit" onClick={() => selectMusics && selectedAdvertising && submit()} loading={isLoading}>
                    Submit
                </Button>
            </Modal>
        </ConfigProvider>
    )
}
