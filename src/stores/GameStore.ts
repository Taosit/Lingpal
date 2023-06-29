import { create } from "zustand";
import TypedEmitter from "typed-emitter"
import EventEmitter from "events";

type GameState = {
  players: Record<string, Player>;
  roomId: string;
  round: number;
  describerOrder: number;
  playerChangeEE: TypedEmitter<{
    ["player-change"]: (newPlayers: Record<string, Player>) => void;
  }>;
  setPlayers: (newPlayers: Record<string, Player>) => void;
  setRoomId: (newRoomId: string) => void;
  setRound: (newRound: number) => void;
  setDescriberOrder: (newDescriberOrder: number) => void;
  initializeSettings: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  players: {},
  roomId: "",
  round: 0,
  describerOrder: 0,
  playerChangeEE: new EventEmitter() as any,
  setPlayers: (newPlayers: Record<string, Player>) =>
    set({ players: newPlayers }),
  setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
  setRound: (newRound: number) => set({ round: newRound }),
  setDescriberOrder: (newDescriberOrder: number) =>
    set({ describerOrder: newDescriberOrder }),
  initializeSettings: () => {
    set({
      players: {},
      roomId: "",
      round: 0,
      describerOrder: 0,
    });
  },
}));
