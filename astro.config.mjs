import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://contracting.serverboi.org",
  output: "static",
  vite: {
    server: {
      watch: {
        ignored: ["**/public/uploads/**"]
      }
    }
  }
});
