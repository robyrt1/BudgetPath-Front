import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/Views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
      },
    },
  },
  plugins: [
    // require('tailwind-scrollbar'),
  ],
} satisfies Config;
