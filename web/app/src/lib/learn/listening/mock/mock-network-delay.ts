/** Simulates API latency until Hono routes exist (500–1000 ms). */
export function mockNetworkDelay(): Promise<void> {
  const ms = 500 + Math.floor(Math.random() * 501)
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
