import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/main.api.ts", "src/main.worker.ts", "src/db/migrate.ts"],
  format: "esm",
  outDir: "dist",
  target: "node22",
  clean: true,
  dts: false,
  sourcemap: true,
})
