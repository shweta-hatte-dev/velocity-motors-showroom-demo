export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink: { 900: "#0c0d0f", 800: "#15171a", 700: "#202328", 600: "#2e3238" }, ember: { DEFAULT: "#ff3d1f", dark: "#d92a10" } },
    fontFamily: { display: ['"Big Shoulders Display"', "Impact", "sans-serif"], sans: ["Manrope", "system-ui", "sans-serif"] }
  } },
  plugins: []
};
