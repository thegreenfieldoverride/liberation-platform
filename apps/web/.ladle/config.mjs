/** @type {import('@ladle/react').UserConfig} */
export default {
  title: "Liberation Platform Components",
  base: "/components/",
  stories: "src/components/**/*.stories.{js,jsx,ts,tsx}",
  addons: {
    theme: {
      themes: [
        {
          name: "Liberation Light",
          colors: {
            primary: "#3B82F6", // blue-500
            secondary: "#10B981", // green-500  
            text: "#1F2937", // gray-800
            background: "#FFFFFF",
          },
        },
        {
          name: "Liberation Dark",
          colors: {
            primary: "#60A5FA", // blue-400
            secondary: "#34D399", // green-400
            text: "#F9FAFB", // gray-50
            background: "#111827", // gray-900
          },
        },
      ],
    },
  },
  viteConfig: "./vite.config.ts",
};