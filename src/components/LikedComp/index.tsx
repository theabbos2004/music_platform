import { MusicCard } from '../shared'
import { IActiveSong } from '../../types'
import { Flex, Row } from 'antd'

export default function LikedComp({ user, song , musics,likeMusicFunc}: { user: any, song: { isPlaying: boolean, activeSong: IActiveSong, currentIndex: number } ,musics:any,likeMusicFunc:any}) {
  return (
    <Flex wrap className="w-full justify-center" gap="middle">
      {
        musics?.length===0?
        <Row>no music liked</Row>
        :musics?.map((music: any, musicIndex: number) => (
          <MusicCard key={musicIndex} musics={musics} music={music} musicIndex={musicIndex} parentIdx={musicIndex} song={song} 
          user={user}
          likeMusicFunc={likeMusicFunc}
          />
      ))
      }
    </Flex>
  )
}
