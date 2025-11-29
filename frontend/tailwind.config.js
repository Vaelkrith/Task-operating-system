module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          50: '#EFF6FF'
        }
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "blob-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.1)" },
          "50%": { transform: "translate(0, 40px) scale(0.9)" },
          "75%": { transform: "translate(-30px, -20px) scale(1.05)" },
        },
        "blob-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-20px, 30px) scale(1.1)" },
          "50%": { transform: "translate(0, -40px) scale(0.9)" },
          "75%": { transform: "translate(30px, 20px) scale(1.05)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "blob-1": "blob-1 10s infinite ease-in-out",
        "blob-2": "blob-2 12s infinite ease-in-out",
      },
    }
  },
  plugins: []
}
