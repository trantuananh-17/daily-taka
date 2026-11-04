import { Hono } from "hono"

import type { AppEnv } from "../../api/types"
import { assertSafeListeningObjectKey } from "../../storage/listening-audio"
import { respondListeningAudio } from "../../storage/listening-audio-response"
import { NotFoundError } from "../../shared/errors"
import { parseListeningLanguageCode } from "./listening.constants"

/** Wildcard audio stream — mounted outside JSON routes so hono/client types stay inferrable. */
export function createListeningAudioRoutes() {
  const app = new Hono<AppEnv>()

  app.get("/audio/*", async (c) => {
    parseListeningLanguageCode(c.req.param("languageCode") ?? "")

    const marker = "/listening/audio/"
    const markerIndex = c.req.path.indexOf(marker)
    if (markerIndex === -1) {
      throw new NotFoundError("Listening audio")
    }
    const storageKey = decodeURIComponent(c.req.path.slice(markerIndex + marker.length))
    assertSafeListeningObjectKey(storageKey)

    return respondListeningAudio(c, storageKey)
  })

  return app
}
