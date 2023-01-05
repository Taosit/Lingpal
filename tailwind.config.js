/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
	theme: {
		extend: {
			backgroundImage: {
				"bi-color-gradient":
					"linear-gradient(180deg, #D37146 20.31%, rgba(255, 255, 255, 0.59375) 60.55%, rgba(0, 92, 145, 0.58) 100%)",
				"yellow-gradient":
					"linear-gradient(90deg, #FDFFEA 0%, rgba(252, 254, 192, 0.7703) 50.52%, rgba(254, 192, 119, 0.44) 100%)",
				"orange-gradient":
					"linear-gradient(180deg, #D37146 50.52%, rgba(211, 113, 70, 0.42) 100%)",
				"green-gradient":
					"linear-gradient(180deg, #46D387 50.52%, rgba(70, 211, 152, 0.29) 100%)",
			},
			boxShadow: {
				"inner-light": "inset 4px 6px 4px rgba(255, 255, 255, 0.19)",
			},
			colors: {
				"transparent-20": "rgba(255, 255, 255, 0.2)",
				"transparent-50": "rgba(255, 255, 255, 0.5)",
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
