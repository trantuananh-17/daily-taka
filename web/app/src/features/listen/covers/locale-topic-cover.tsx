import type { TopicCover } from "@/lib/learn/listening/cover-theme"

import { coverThemeStyle } from "@/features/listen/covers/cover-theme-style"
import { EnTopicCoverSvg } from "@/features/listen/covers/en-topic-cover"
import { JpTopicCoverSvg } from "@/features/listen/covers/jp-topic-cover"
import { ZhTopicCoverSvg } from "@/features/listen/covers/zh-topic-cover"

type LocaleTopicCoverProps = {
  cover: TopicCover
}

export function LocaleTopicCover({ cover }: LocaleTopicCoverProps) {
  const style = coverThemeStyle(cover.variant, cover.theme)
  const dataAttr =
    cover.variant === "jp"
      ? { "data-jp-topic": cover.topicKey }
      : cover.variant === "zh"
        ? { "data-zh-topic": cover.topicKey }
        : { "data-en-topic": cover.topicKey }

  return (
    <span
      className={`topic-cover ${cover.variant}-topic-cover`}
      {...dataAttr}
      style={style}
      aria-hidden
    >
      {cover.variant === "jp" ? (
        <JpTopicCoverSvg topicKey={cover.topicKey} />
      ) : cover.variant === "zh" ? (
        <ZhTopicCoverSvg topicKey={cover.topicKey} />
      ) : (
        <EnTopicCoverSvg topicKey={cover.topicKey} />
      )}
    </span>
  )
}
