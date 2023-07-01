import { create } from "zustand";
import TypedEmitter from "typed-emitter";
import EventEmitter from "events";

type GameState = {
  players: Record<string, Player>;
  roomId: string;
  round: number;
  describerOrder: number;
  playerChangeEE: TypedEmitter<{
    ["player-change"]: (newPlayers: Record<string, Player>) => void;
  }>;
  messages: Message[];
  setPlayers: (newPlayers: Record<string, Player>) => void;
  setRoomId: (newRoomId: string) => void;
  setRound: (newRound: number) => void;
  setDescriberOrder: (newDescriberOrder: number) => void;
  addMessage: (newMessage: Message) => void;
  clearMessages: () => void;
  initializeSettings: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  players: {},
  roomId: "",
  round: 0,
  describerOrder: 0,
  playerChangeEE: new EventEmitter() as any,
  messages: [],
  setPlayers: (newPlayers: Record<string, Player>) =>
    set({ players: newPlayers }),
  setRoomId: (newRoomId: string) => set({ roomId: newRoomId }),
  setRound: (newRound: number) => set({ round: newRound }),
  setDescriberOrder: (newDescriberOrder: number) =>
    set({ describerOrder: newDescriberOrder }),
  addMessage: (newMessage: Message) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
  clearMessages: () => set({ messages: [] }),
  initializeSettings: () => {
    set({
      players: {},
      roomId: "",
      round: 0,
      describerOrder: 0,
    });
  },
}));
