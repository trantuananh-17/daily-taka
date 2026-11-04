import { ZhCoverArtGroup, ZhCoverFrame } from "@/features/listen/covers/zh-frame"
import { ZH_TOPIC_ARTS } from "@/features/listen/covers/zh-arts"

type ZhTopicCoverSvgProps = {
  topicKey: string
}

export function ZhTopicCoverSvg({ topicKey }: ZhTopicCoverSvgProps) {
  const render = ZH_TOPIC_ARTS[topicKey] ?? ZH_TOPIC_ARTS["short-stories"]
  return <ZhCoverFrame art={<ZhCoverArtGroup>{render()}</ZhCoverArtGroup>} />
}
