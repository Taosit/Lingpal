import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";

export const useIsUserDescriber = () => {
  const describerOrder = useGameStore((state) => state.describerOrder);
  const players = useGameStore((state) => state.players);
  const user = useAuthStore((state) => state.user);

  return user && players[user.id] && players[user.id].order === describerOrder;
};
