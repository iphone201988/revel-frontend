import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "dfebfecc4f9f.ngrok-free.app",
      "nwhh0r9m-4173.inc1.devtunnels.ms",
    ], // 👈 Add your ngrok domain here
  },
});

// import react from "@vitejs/plugin-react-swc";
// import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: "0.0.0.0",
//   },
// });
