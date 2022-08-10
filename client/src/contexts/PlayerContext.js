import React, { useState, useContext, createContext } from "react";

const PlayerContext = createContext();

const usePlayerContext = () => {
	return useContext(PlayerContext);
};

const PlayerContextProvider = ({ children }) => {
	const [players, setPlayers] = useState({});

	const [inGame, setInGame] = useState(false);
	const [roomId, setRoomId] = useState(null);
	const [round, setRound] = useState(0);

	const updatePlayerNotes = (playerId, notes) => {
		setPlayers(prev => ({ ...prev, [playerId]: { ...prev[playerId], notes } }));
	};

	const increasePlayerScore = (playerId, earnedScore) => {
		setPlayers(prev => ({
			...prev,
			[playerId]: {
				...prev[playerId],
				score: prev[playerId].score + earnedScore,
			},
		}));
	};

	return (
		<PlayerContext.Provider
			value={{
				players,
				setPlayers,
				updatePlayerNotes,
				increasePlayerScore,
				round,
				setRound,
				roomId,
				setRoomId,
				inGame,
				setInGame,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export { usePlayerContext, PlayerContextProvider };
