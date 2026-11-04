import { JpCoverArtGroup, JpCoverFrame } from "@/features/listen/covers/jp-frame"
import { JP_TOPIC_ARTS } from "@/features/listen/covers/jp-arts"

type JpTopicCoverSvgProps = {
  topicKey: string
}

export function JpTopicCoverSvg({ topicKey }: JpTopicCoverSvgProps) {
  const render = JP_TOPIC_ARTS[topicKey] ?? JP_TOPIC_ARTS.anime
  return <JpCoverFrame art={<JpCoverArtGroup>{render()}</JpCoverArtGroup>} />
}
