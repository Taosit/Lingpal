import useAuthAxios from "@/hooks/useAuthAxios";
import { useAuthStore } from "@/stores/AuthStore";
import { useCallback } from "react";

export const useUpdateStats = () => {
  const authAxios = useAuthAxios();
  const { user, setUser } = useAuthStore();

  const updateStats = useCallback(
    async (data: { win: boolean; advanced: boolean }) => {
      const { win, advanced } = data;
      authAxios
        .post("/api/update_stats", {
          data,
        })
        .then((response) => {
          if (response.status === 200) {
            if (!user) return;
            const userCopy = { ...user };
            userCopy.total++;
            win && userCopy.win++;
            advanced && userCopy.advanced++;
            setUser(userCopy);
          } else {
            console.log("Something went wrong");
          }
        });
    },
    [authAxios, setUser, user]
  );

  return updateStats;
};
