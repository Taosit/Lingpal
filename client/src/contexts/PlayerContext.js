import React, { useState, useContext, createContext } from "react";
import { chooseWords } from "../utils/words";
import avatar from "../assets/avatar.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";
import defaultAvatar from "../assets/default_avatar.png";

const PlayerContext = createContext();

const usePlayerContext = () => {
	return useContext(PlayerContext);
};

const PlayerContextProvider = ({ children }) => {
	const [players, setPlayers] = useState([
		{
			username: "Taosit",
			avatar,
			win: 64,
		},
		{
			username: "Olivier",
			avatar: avatar2,
			win: 41,
		},
		{
			username: "Valencia",
			avatar: avatar3,
			win: 53,
		},
		null,
	]);

	const [round, setRound] = useState(0);

	const addPlayer = newPlayer => {
		const { username, avatar, win } = newPlayer;
		let firstEmpty = true;
		setPlayers(prev =>
			prev.map(player => {
				if (!player && firstEmpty) {
					firstEmpty = false;
					const displayedAvatar = avatar || defaultAvatar;
					return { username, avatar: displayedAvatar, win };
				} else {
					return player;
				}
			})
		);
	};

	const initializePlayers = () => {
		const words = chooseWords(players.length * 3);
		words.push(null);
		setPlayers(prev =>
			prev.map((player, i) => ({
				...player,
				score: 0,
				words: words.slice(i * 3, i * 3 + 3),
			}))
		);
	};

	const updatePlayerNotes = (playerNum, notes) => {
		setPlayers(prev =>
			prev.map((player, i) => {
				if (playerNum === i) {
					return { ...player, notes };
				}
				return player;
			})
		);
	};

	const increasePlayerScore = (playerNum, earnedScore) => {
		setPlayers(prev =>
			prev.map((player, i) => {
				if (playerNum === i) {
					return { ...player, score: player.score + earnedScore };
				}
				return player;
			})
		);
	};

	return (
		<PlayerContext.Provider
			value={{
				players,
				addPlayer,
				initializePlayers,
				updatePlayerNotes,
				increasePlayerScore,
				round,
				setRound,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export { usePlayerContext, PlayerContextProvider };
