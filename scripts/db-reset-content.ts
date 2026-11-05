/**
 * Migrate + bootstrap curricula + content seeds (listen, vocab EN A1, writing EN A1).
 * Run: pnpm db:reset-content
 */
import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(new URL("../", import.meta.url)))

function run(cmd: string) {
  console.info(`> ${cmd}`)
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env })
}

run("pnpm db:migrate")
run("pnpm db:bootstrap-curricula")
run("pnpm db:seed")
run("pnpm db:seed:vocab")
run("pnpm db:seed:writing")
