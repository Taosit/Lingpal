export const NOTE_TIME = 20;
export const TURN_TIME_STANDARD = 60;
export const TURN_TIME_RELAXED = 90;
export const FEEDBACK_TIME = 5;

export const ABOUT_TEXT = [
  [
    {
      title: "About Lingpal",
      text: "Lingpal is multiplayer game that helps you practice your target language in a fun way. It is a simplified version of the Taboo game, since there are not “taboo” words except for the word being described.",
    },
    {
      title: "Start a game",
      text: "A game starts with 2-4 players. If there are fewer than 4 players, all players need to be ready before the game can start. When the 4th player enters the game room, the game will automatically start.",
    },
    {
      title: "During a game",
      text: "There are 2 rounds in each game. Each round begins by assigning each player their secret word. Players have some time to take notes, which will be accessible to them at their turn. During the game, the guesser who first gets the secret word wins the turn and earns 2 points. The describer also earns 1 point. A turn times out if no player gets the secret word in some time. In that case, no one earns points.",
    },
  ],
  [
    {
      title: "Modes",
      subtitle: "Standard | Relaxed",
      text: "How competitive the game is. In the standard mode, players are not asked to rate the description and the players’ statistics are updated after each game. In the relaxed more, a turn may last longer and the description will be rated, but neither the rating nor the score will affect the player’s statistics.",
    },
    {
      title: "Levels",
      subtitle: "Easy | Hard",
      text: "How hard the words are. The easy level has more concrete objects that are straight-forward to describe, while words in the hard mode can be more abstract and therefore requires more thoughtful descriptions.",
    },
    {
      title: "Describers",
      subtitle: "Text | Voice",
      text: "How is a word described. Text means that the describer uses the chat box to send the description. Voice means that the describer speaks to other players in real time. All other players always use the chatbox.",
    },
  ],
] as const;

export const motionVariant = {
  hidden: {
    translateX: 100,
    opacity: 0,
  },
  show: {
    translateX: 0,
    opacity: 1,
  },
};

export const staticVariant = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};
