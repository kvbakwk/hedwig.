/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    extend: {
      screens: {
        sm: "600px",
        md: "905px",
        lg: "1240px",
        xl: "1440px",
      },
      colors: {
        background: "rgb(var(--background)/1)",
        foreground: "rgb(var(--foreground)/1)",
        shadow: "rgb(var(--shadow)/1)",
      },
      boxShadow: {
        none: "0px 0px 0px 0px rgba(0, 0, 0, 0.1)",
        xs: "0px 4px 10px 0px rgba(0, 0, 0, 0.1)",
        sm: "0px 4px 20px 0px rgba(0, 0, 0, 0.1)",
        md: "0px 4px 30px 0px rgba(0, 0, 0, 0.1)",
        lg: "0px 4px 40px 0px rgba(0, 0, 0, 0.1)",
        xl: "0px 4px 50px 0px rgba(0, 0, 0, 0.1)",
      },
      borderWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
      },
      transitionProperty: {
        radius: "border-radius",
      },
    },
  },
  plugins: [],
};
