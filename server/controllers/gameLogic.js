const { chooseWords } = require("../utils/words");

const getEndTime = timeValue => {
	let time = new Date();
	time.setSeconds(time.getSeconds() + parseInt(timeValue));
	return time.getTime();
};

const setTimer = (io, room, allowdTime, callback = null) => {
	const endTime = getEndTime(allowdTime);
	const interval = setInterval(() => {
		const updatedTime = Math.round((endTime - new Date().getTime()) / 1000);
		io.to(room).emit("time-update", updatedTime);
		if (updatedTime <= 0) {
			clearInterval(interval);
			// callback();
		}
	}, 1000);
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

module.exports = { setTimer, initializePlayers };
