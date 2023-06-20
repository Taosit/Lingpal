import { create } from "zustand";

type AuthState = {
  loading: boolean;
  user: Player | null;
  accessToken: string;
  setLoading: (newLoading: boolean) => void;
  setUser: (newUser: Player | null) => void;
  setAccessToken: (newAccessToken: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loading: true,
  user: null,
  accessToken: "",
  setLoading: (newLoading: boolean) => set({ loading: newLoading }),
  setUser: (newUser: Player | null) => set({ user: newUser }),
  setAccessToken: (newAccessToken: string) =>
    set({ accessToken: newAccessToken }),
}));
