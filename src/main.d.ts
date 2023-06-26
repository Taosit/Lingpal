declare module "next-cloudinary";
declare module "react-star-ratings";
declare module "jsonwebtoken";

type Player = {
  id: string;
  username: string;
  avatar: string;
  total: number;
  win: number;
  advanced: number;
  isReady: boolean;
  score: number;
  order: number;
  words: null | string[];
  notes: null | string[];
  isDescriber: boolean;
};

type PlayerMessage = {
  sender: Player;
  isBot: false;
  isDescriber: boolean;
  text: string;
};

type BotMessage = {
  sender: null;
  isBot: true;
  isDescriber: null;
  text: string;
};

type Message = PlayerMessage | BotMessage;

type ReceivingSocketEvent = {
  "start-game": Record<string, Player>;
  "correct-answer": Record<string, Player>;
  "turn-updated": {
    nextRound: number;
    nextDesc: number;
    players: Record<string, Player>;
  };
  "player-left": {
    disconnectingPlayer: Player;
    remainingPlayers: Record<string, Player>;
    nextRound?: number;
    nextDesc?: number;
  };
  "game-over": Record<string, Player & { rank: number }>;
  "receive-message": Message;
  "turn-updated": {
    nextRound: number;
    nextDesc: number;
    players: Record<string, Player>;
  };
  "rating-update": number;
};

type EmittingSocketEvent = {
  "join-room": {
    settings: {
      mode: "standard" | "relaxed" | null;
      level: "easy" | "hard" | null;
      describer: "voice" | "text" | null;
    };
    player: Player;
    callback: (roomId: string) => void;
  };
  "player-ready": undefined;
  "set-timer": number;
  "save-notes": string[];
  "update-turn": undefined;
  "send-message": {
    message: string;
    targetWord: string;
  };
  "send-rating": number;
  "clear-ratings": undefined;
};

type SocketEvent = ReceivingSocketEvent & EmittingSocketEvent;
