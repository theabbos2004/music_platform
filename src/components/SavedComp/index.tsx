import { MusicCard } from '../shared'
import { IActiveSong } from '../../types'
import { Flex, Row } from 'antd'

export default function SavedComp({ user, song , musics,saveMusicFunc}: { user: any, song: { isPlaying: boolean, activeSong: IActiveSong, currentIndex: number },currentUser:any ,musics:any,saveMusicFunc:any}) {
  return (
    <Flex wrap className="w-full justify-center" gap="middle">
      {
        musics?.length===0?
        <Row>no music marked</Row>
        :musics?.map((music: any, musicIndex: number) => (
          <MusicCard key={musicIndex} musics={musics} music={music} musicIndex={musicIndex} parentIdx={musicIndex} song={song} 
          user={user}
          saveMusicFunc={saveMusicFunc}
          />
      ))
      }
    </Flex>
  )
}
