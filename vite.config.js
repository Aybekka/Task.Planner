import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase into its own cached chunk — largest single dependency
          if (id.includes("node_modules/firebase")) return "firebase";
          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) return "react";
          // Redux
          if (
            id.includes("node_modules/@reduxjs/") ||
            id.includes("node_modules/react-redux/") ||
            id.includes("node_modules/redux/") ||
            id.includes("node_modules/reselect/") ||
            id.includes("node_modules/immer/")
          ) return "redux";
          // Drag and drop
          if (id.includes("node_modules/@dnd-kit/")) return "dnd";
          // Drawing library — only loaded when draw tab is opened
          if (id.includes("node_modules/perfect-freehand")) return "canvas";
        },
      },
    },
    // Raise warning threshold since Firebase is intentionally large
    chunkSizeWarningLimit: 600,
  },
});
