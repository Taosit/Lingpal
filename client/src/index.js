import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingContextProvider } from "./contexts/SettingContext";
import { PlayerContextProvider } from "./contexts/PlayerContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { SocketContextProvider } from "./contexts/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<AuthContextProvider>
		<SettingContextProvider>
			<PlayerContextProvider>
				<SocketContextProvider>
					<App />
				</SocketContextProvider>
			</PlayerContextProvider>
		</SettingContextProvider>
	</AuthContextProvider>
	// </React.StrictMode>
);
