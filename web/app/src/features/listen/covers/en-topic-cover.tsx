import { EnCoverArtGroup, EnCoverFrame } from "@/features/listen/covers/en-frame"
import { EN_TOPIC_ARTS } from "@/features/listen/covers/en-arts"

type EnTopicCoverSvgProps = {
  topicKey: string
}

export function EnTopicCoverSvg({ topicKey }: EnTopicCoverSvgProps) {
  const render = EN_TOPIC_ARTS[topicKey] ?? EN_TOPIC_ARTS["short-stories"]
  return <EnCoverFrame art={<EnCoverArtGroup>{render()}</EnCoverArtGroup>} />
}
