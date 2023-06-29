import { create } from "zustand";

type SettingState = {
  settings: {
    mode: null | "standard" | "relaxed";
    level: null | "easy" | "hard";
    describer: null | "voice" | "text";
  };
  setMode: (newMode: null | "standard" | "relaxed") => void;
  setLevel: (newLevel: null | "easy" | "hard") => void;
  setDescriber: (newDescriber: null | "voice" | "text") => void;
};

export const useSettingStore = create<SettingState>((set) => ({
  settings: {
    mode: null,
    level: null,
    describer: null,
  },
  setMode: (newMode) =>
    set((state) => ({
      settings: {
        ...state.settings,
        mode: newMode,
      },
    })),
  setLevel: (newLevel) =>
    set((state) => ({
      settings: {
        ...state.settings,
        level: newLevel,
      },
    })),
  setDescriber: (newDescriber) =>
    set((state) => ({
      settings: {
        ...state.settings,
        describer: newDescriber,
      },
    })),
}));
