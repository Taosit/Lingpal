/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
	theme: {
		extend: {
			boxShadow: {
				"inner-light": "inset 5px 8px 4px rgba(255, 255, 255, 0.2)",
			},
			colors: {
				"transparent-20": "rgba(255, 255, 255, 0.2)",
				"transparent-50": "rgba(255, 255, 255, 0.5)",
				"color1": "#00BC9B",
				"color1-light": "#36d3b7",
				"color1-lighter": "#9DF5DD",
				"color1-dark": "#078770",
				"color1-variant": "#BCFFDF",
				"color2": "#A228E9",
				"color2-light": "#CB46FA",
				"color2-lighter": "#DD7CFF",
			},
			screens: {
				sm: "480px",
				md: "640px",
				lg: "1024px",
				xl: "1280px",
			},
			height: {
				500: "512px",
				700: "700px",
				"9/10": "90%",
			},
			minHeight: {
				auto: "auto",
			},
			maxHeight: {
				700: "700px",
			},
			gridTemplateRows: {
				layout1: "auto auto minmax(0, 1fr) auto",
				layout2: "auto minmax(0, 1fr) auto",
				layout3: "minmax(0, 1fr) auto",
				layout4: "minmax(0, 1fr) minmax(0, 1fr)",
				layout5: "auto minmax(0, 1fr)",
				layout6: "auto auto minmax(0, 1fr)",
			},
			aspectRatio: {
				"4/3": "4 / 3",
			},
		},
	},
	plugins: [],
};
