import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingContextProvider } from "./contexts/SettingContext";
import { PlayerContextProvider } from "./contexts/PlayerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SettingContextProvider>
			<PlayerContextProvider>
				<App />
			</PlayerContextProvider>
		</SettingContextProvider>
	</React.StrictMode>
);
