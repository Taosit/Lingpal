type Player = {
  id: string;
  username: string;
  avatar: string;
  total: number;
  win: number;
  advanced: number;
  isReady: boolean;
  order: number;
  words: null | string[];
  notes: null | string[];
};

type ReceivingSocketEvent = {
  "start-game": Record<string, Player>;
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
  "player-ready": {
    playerId: string;
    roomId: string;
  };
};

type SocketEvent = ReceivingSocketEvent & EmittingSocketEvent;
