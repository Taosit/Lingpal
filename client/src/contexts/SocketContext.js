import React, { createContext, useContext, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useGameContext } from "./GameContext";
import { useSettingContext } from "./SettingContext";

const SocketContext = createContext();

const useSocketContext = () => {
	return useContext(SocketContext);
};

const SocketContextProvider = ({ children }) => {
	const devUrl = "http://localhost:5000";
	const productionUrl = "https://lingpal.herokuapp.com";
	const { socket, online, connectSocket, disconnectSocket } =
		useSocket(productionUrl);
	const { inGame, setPlayers } = useGameContext();

	useEffect(() => {
		if (inGame) {
			connectSocket();
		} else {
			disconnectSocket();
		}
	}, [connectSocket, inGame]);

	useEffect(() => {
		socket?.on("update-players", players => {
			setPlayers(players);
		});
	}, [socket]);

	return (
		<SocketContext.Provider
			value={{ socket, online, connectSocket, disconnectSocket }}
		>
			{children}
		</SocketContext.Provider>
	);
};

export { useSocketContext, SocketContextProvider };
