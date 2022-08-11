import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingContextProvider } from "./contexts/SettingContext";
import { GameContextProvider } from "./contexts/GameContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { SocketContextProvider } from "./contexts/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<AuthContextProvider>
		<SettingContextProvider>
			<GameContextProvider>
				<SocketContextProvider>
					<App />
				</SocketContextProvider>
			</GameContextProvider>
		</SettingContextProvider>
	</AuthContextProvider>
	// </React.StrictMode>
);
