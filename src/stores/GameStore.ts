import { create } from "zustand";

type GameState = {
  players: Player[];
  inGame: boolean;
  roomId: string;
  round: number;
  describerIndex: number;
  leftPlayers: Player[] | null;
  setPlayers: (newPlayers: Player[]) => void;
  setInGame: (newInGame: boolean) => void;
  setRoomId: (newRoomId: string) => void;
  setRound: (newRound: number) => void;
  setDescriberIndex: (newDescriberIndex: number) => void;
  setLeftPlayers: (newLeftPlayers: Player[] | null) => void;
};

export const useGameStore = create<GameState>((set) => ({
  players: [],
  inGame: false,
  roomId: "",
  round: 0,
  describerIndex: 0,
  leftPlayers: null,
  setPlayers: (newPlayers: Player[]) => set({ players: newPlayers }),
  setInGame: (newInGame: boolean) => set({ inGame: newInGame }),
  setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
  setRound: (newRound: number) => set({ round: newRound }),
  setDescriberIndex: (newDescriberIndex: number) =>
    set({ describerIndex: newDescriberIndex }),
  setLeftPlayers: (newLeftPlayers: Player[] | null) =>
    set({ leftPlayers: newLeftPlayers }),
}));
