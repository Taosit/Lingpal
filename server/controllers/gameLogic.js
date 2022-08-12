const { rooms } = require("../model/rooms");
const { chooseWords } = require("../utils/words");

const getEndTime = timeValue => {
	let time = new Date();
	time.setSeconds(time.getSeconds() + parseInt(timeValue));
	return time.getTime();
};

const checkGameStart = players => {
	const playerArr = Object.values(players);
	if (playerArr.length === 4) {
		return true;
	}
	return playerArr.every(p => p.isReady);
};

const setTimer = (io, room, allowdTime) => {
	const endTime = getEndTime(allowdTime);
	const interval = setInterval(() => {
		const updatedTime = Math.round((endTime - new Date().getTime()) / 1000);
		io.to(room).emit("time-update", updatedTime);
		if (updatedTime <= 0) {
			clearInterval(interval);
		}
	}, 1000);
	return interval;
};

const initializePlayers = players => {
	const words = chooseWords(Object.keys(players).length * 3);
	words.push(null);
	const newPlayers = {};
	Object.entries(players).forEach(([id, player], i) => {
		const newPlayer = { ...player };
		newPlayer.score = 0;
		newPlayer.words = words.slice(i * 3, i * 3 + 3);
		newPlayers[id] = newPlayer;
	});
	return newPlayers;
};

const updatePlayerNotes = (players, playerId, notes) => {
	const playerToUpdate = players[playerId];
	return { ...players, [playerId]: { ...playerToUpdate, notes } };
};

const describerIsPresent = (players, desc) => {
	const playerArr = Object.values(players);
	return playerArr.some(p => p.order === desc);
};

const getNextTurn = ({
	players,
	describerIndex,
	round,
	originalPlayerNumber,
}) => {
	let nextDesc = describerIndex;
	let nextRound = round;
	do {
		if (nextDesc === originalPlayerNumber - 1) {
			nextRound++;
			nextDesc = 0;
		} else {
			nextDesc++;
		}
	} while (!describerIsPresent(players, nextDesc));
	return { nextDesc, nextRound };
};

const increasePlayerScore = (players, playerId, earnedScore) => {
	const scoringPlayer = players[playerId];
	return {
		...players,
		[playerId]: { ...scoringPlayer, score: scoringPlayer.score + earnedScore },
	};
};

const startGame = (io, waitroom) => {
	const newPlayers = initializePlayers(waitroom.players);
	io.to(waitroom.id).emit("game-start", {
		players: newPlayers,
		roomId: waitroom.id,
	});
	rooms[waitroom.id] = {
		players: newPlayers,
		round: 0,
		describerIndex: 0,
		originalPlayerNumber: Object.keys(newPlayers).length,
	};
};

const calculateGameStats = players => {
	const playerArray = Object.values(players);
	const playersWithRank = { ...players };
	playerArray.forEach(player => {
		const rank = playerArray.reduce((rank, p) => {
			if (player.score < p.score) return rank + 1;
			return rank;
		}, 1);
		playersWithRank[player._id].rank = rank;
	});
	const rankSum = Object.values(playersWithRank).reduce((total, player) => {
		return total + player.rank;
	}, 0);
	playerArray.forEach(player => {
		playersWithRank[player._id].win =
			playersWithRank[player._id].rank <= rankSum / playerArray.length;
	});
	return playersWithRank;
};

module.exports = {
	setTimer,
	checkGameStart,
	startGame,
	initializePlayers,
	updatePlayerNotes,
	getNextTurn,
	increasePlayerScore,
	calculateGameStats,
};
