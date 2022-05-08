module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "width": { 
        "500p":'500px'  
      },
      "minWidth": {
        "100p": '100px'
      },
      "borderWidth": {
        "2p": "2px"
      }
    },
  },
  plugins: [],
}
