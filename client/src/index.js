import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SettingContextProvider } from "./utils/contexts/SettingContext";
import { GameContextProvider } from "./utils/contexts/GameContext";
import { AuthContextProvider } from "./utils/contexts/AuthContext";
import { SocketContextProvider } from "./utils/contexts/SocketContext";

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
