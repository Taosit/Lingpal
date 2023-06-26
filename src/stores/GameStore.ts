import { create } from "zustand";

type GameState = {
  players: Record<string, Player>;
  roomId: string;
  round: number;
  describerIndex: number;
  leftPlayers: Player[] | null;
  setPlayers: (newPlayers: Record<string, Player>) => void;
  setRoomId: (newRoomId: string) => void;
  setRound: (newRound: number) => void;
  setDescriberIndex: (newDescriberIndex: number) => void;
  leaveNoteRoom: (player: Player | null) => void;
  initializeSettings: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  players: {},
  roomId: "",
  round: 0,
  describerIndex: 0,
  leftPlayers: null,
  setPlayers: (newPlayers: Record<string, Player>) =>
    set({ players: newPlayers }),
  setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
  setRound: (newRound: number) => set({ round: newRound }),
  setDescriberIndex: (newDescriberIndex: number) =>
    set({ describerIndex: newDescriberIndex }),
  leaveNoteRoom: (player: Player | null) =>
    set((state) => {
      if (!player) {
        return {
          leftPlayers: null,
        };
      }
      if (!state.leftPlayers) {
        return {
          leftPlayers: [player],
        };
      } else {
        return {
          leftPlayers: [...state.leftPlayers, player],
        };
      }
    }),
  initializeSettings: () => {
    set({
      players: {},
      roomId: "",
      round: 0,
      describerIndex: 0,
    });
  },
}));
