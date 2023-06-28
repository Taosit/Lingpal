import { create } from "zustand";

type GameState = {
  players: Record<string, Player>;
  roomId: string;
  round: number;
  describerIndex: number;
  setPlayers: (newPlayers: Record<string, Player>) => void;
  setRoomId: (newRoomId: string) => void;
  setRound: (newRound: number) => void;
  setDescriberIndex: (newDescriberIndex: number) => void;
  initializeSettings: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  players: {},
  roomId: "",
  round: 0,
  describerIndex: 0,
  setPlayers: (newPlayers: Record<string, Player>) =>
    set({ players: newPlayers }),
  setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
  setRound: (newRound: number) => set({ round: newRound }),
  setDescriberIndex: (newDescriberIndex: number) =>
    set({ describerIndex: newDescriberIndex }),
  initializeSettings: () => {
    set({
      players: {},
      roomId: "",
      round: 0,
      describerIndex: 0,
    });
  },
}));
