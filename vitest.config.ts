import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Los tests sustituyen document/navigator/console por stubs explícitos,
    // así que no hace falta montar un DOM completo.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
