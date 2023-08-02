# Lingpal

A multiplayer game to practice your target language. Live on [https://lingpal.vercel.app/](https://lingpal.vercel.app/).
Backend repo: [https://github.com/Taosit/Linpal-server](https://github.com/Taosit/Linpal-server).

## How to use

An account is needed to play the game. After logging in, you will have access to a dashboard with your game statistics, your notes and recordings, and a play button. There are 3 settings regarding the level, the use of microphone, and the game mode. After selecting the game options, you will be brought to a waiting room. There needs to be 4 players in order for the game to start. Once the game starts, you will receive the word that you are going to describe. You will be given some time to take notes. Then, players describe their assigned word in turn. A turn ends when another player makes the correct guess or it times out. After 3 rounds, the game ends and you will be sent back to the waiting room.

## Settings

- level: Beginner and advanced. The beginner's level features images associated with each word. Guessers need to first choose the correct image before they can use the chatbox to type in their guessed word. The words for this level are straight-forward. Since the images also help with making the right guess, the describer's job is relatively easy. Therefore, it is a good place to get started with using a language. In the advanced level, there is no image associated with each word, so the describer has to provide some details to distinguish the target word from similar ones. Some words can be a little abstract to really challenge the players, but the overly abstract words are removed from the inventory.

- Use of microphone: This describes whether the describer speaks or uses the chatbox. All other players need to type their answers or clarifying questions. If the player uses the mocrophone, they can choose to record their own description to be reviewed later. This provides an opportunity to correct and expand their descriptions and improve their speaking skills. Players can save any message in the chatbox regardless of the sender of the message or the use of microphone.

- Mode: Game mode and learning mode. In the game mode, the game level and results contribute to the player's statistics that are visible to other players in the waiting room. However, in the learning mode, only the game count is incremented for the player. Players also have longer time to describe their assigned words to allow them form better sentences and give more in-depth descriptions. After each round, the description will be rated by all other players, even though the rating itself does not affect a player's statistics.

## Technologies

- React
- TypeScript
- NextJS
- Deno
- MongoDB
- TailwindCSS
- JWT token
- Socket.io
- WebRTC
