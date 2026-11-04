import { Readable } from "node:stream"

import type { Context } from "hono"

import {
  listeningAudioContentType,
  openListeningAudioStream,
  parseByteRangeHeader,
  resolveListeningAudioSource,
} from "./listening-audio"

function nodeStreamToWeb(stream: NodeJS.ReadableStream): ReadableStream {
  return Readable.toWeb(stream as Readable) as ReadableStream
}

export async function respondListeningAudio(c: Context, storageKey: string) {
  const source = await resolveListeningAudioSource(storageKey)
  const fileSize = source.size
  const contentType = listeningAudioContentType(source)
  const byteRange = parseByteRangeHeader(c.req.header("range"), fileSize)

  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=86400",
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
  }

  let status = 200
  if (byteRange) {
    const { start, end } = byteRange
    headers["Content-Range"] = `bytes ${start}-${end}/${fileSize}`
    headers["Content-Length"] = String(end - start + 1)
    status = 206
    const body = await openListeningAudioStream(source, byteRange)
    return c.newResponse(nodeStreamToWeb(body), { status, headers })
  }

  headers["Content-Length"] = String(fileSize)
  const body = await openListeningAudioStream(source)
  return c.newResponse(nodeStreamToWeb(body), { status, headers })
}
