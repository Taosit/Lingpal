import { create } from "zustand";

type AuthState = {
  loading: boolean;
  user: Player | null;
  accessToken: string;
  setLoading: (newLoading: boolean) => void;
  setUser: (newUser: Player | null) => void;
  setAccessToken: (newAccessToken: string) => void;
  updateUserScore: (updates: {
    total?: number;
    win?: number;
    advanced?: number;
  }) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loading: true,
  user: null,
  accessToken: "",
  setLoading: (newLoading: boolean) => set({ loading: newLoading }),
  setUser: (newUser: Player | null) => set({ user: newUser }),
  setAccessToken: (newAccessToken: string) =>
    set({ accessToken: newAccessToken }),
  updateUserScore: (updates: {
    total?: number;
    win?: number;
    advanced?: number;
  }) => {
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          total: updates.total
            ? state.user.total + updates.total
            : state.user.total,
          win: updates.win ? state.user.win + updates.win : state.user.win,
          advanced: updates.advanced
            ? state.user.advanced + updates.advanced
            : state.user.advanced,
        },
      };
    });
  },
}));
