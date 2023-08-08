import { useCallback, useEffect, useRef } from "react";
import { useRegisterSocketListener } from "./useRegisterSocketListener";
import { useGameStore } from "@/stores/GameStore";
import { shallow } from "zustand/shallow";
import { emitSocketEvent } from "@/utils/helpers";
import { useUpdateStats } from "@/components/GameRoom/useUpdateStats";
import { useSettingStore } from "@/stores/SettingStore";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/AuthStore";
import { useSocketContext } from "@/contexts/SocketContext";

export const useRegisterGameRoomListeners = ({
  startTimer,
  endTurn,
  initiatePeerConnection,
  acceptPeerConnection,
  destroyPeerConnection,
  destroyPlayerPeerConnection,
}: {
  startTimer: () => void;
  endTurn: () => void;
  initiatePeerConnection: (players: Record<string, Player>) => void;
  acceptPeerConnection: () => void;
  destroyPeerConnection: () => void;
  destroyPlayerPeerConnection: (id: string) => void;
}) => {
  const { socket } = useSocketContext();

  const {
    storePlayers,
    playerChangeEE,
    setPlayers,
    round,
    setRound,
    describerOrder,
    setDescriberOrder,
    clearMessages,
  } = useGameStore(
    (store) => ({
      storePlayers: store.players,
      playerChangeEE: store.playerChangeEE,
      setPlayers: store.setPlayers,
      round: store.round,
      setRound: store.setRound,
      describerOrder: store.describerOrder,
      setDescriberOrder: store.setDescriberOrder,
      clearMessages: store.clearMessages,
    }),
    shallow
  );

  const user = useAuthStore((store) => store.user);
  const thisPlayer = storePlayers[user?.id ?? ""];

  const { mode, level } = useSettingStore(
    (store) => ({
      mode: store.settings.mode,
      level: store.settings.level,
    }),
    shallow
  );

  const handlePlayerChange = useCallback(
    (players: Record<string, Player>) => {
      const isFirstDescriber = Object.values(players).every(
        (player) => player.order >= describerOrder
      );
      if (!isFirstDescriber) {
        return;
      }

      startTimer();
      emitSocketEvent(socket, "start-round");
    },
    [describerOrder, socket, startTimer]
  );

  const initialPlayerChangeHandled = useRef(false);
  useEffect(() => {
    if (initialPlayerChangeHandled.current) {
      return;
    }
    initialPlayerChangeHandled.current = true;
    handlePlayerChange(storePlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playerChangeEE.on("player-change", handlePlayerChange);

    return () => {
      playerChangeEE.off("player-change", handlePlayerChange);
    };
  }, [playerChangeEE, handlePlayerChange]);

  const updateStats = useUpdateStats();

  const router = useRouter();

  const updatePeerConnection = useCallback(
    (nextDesc: number, nextRound: number, players: Record<string, Player>) => {
      destroyPeerConnection();
      if (nextRound === round && thisPlayer?.order === nextDesc) {
        initiatePeerConnection(players);
      } else if (nextRound === round) {
        acceptPeerConnection();
      }
    },
    [
      acceptPeerConnection,
      destroyPeerConnection,
      initiatePeerConnection,
      round,
      thisPlayer?.order,
    ]
  );

  const updateRoundAndDescriber = useCallback(
    (nextDesc: number, nextRound: number) => {
      if (nextRound === round) {
        setDescriberOrder(nextDesc);
        startTimer();
      } else {
        setRound(nextRound);
        setDescriberOrder(nextDesc);
        router.push("/notes-room");
      }
    },
    [round, router, setDescriberOrder, setRound, startTimer]
  );

  const correctAnswerListener = useCallback(
    (players: SocketEvent["correct-answer"]) => {
      setPlayers(players);
      endTurn();
    },
    [endTurn, setPlayers]
  );
  useRegisterSocketListener("correct-answer", correctAnswerListener);

  const turnUpdatedListener = useCallback(
    ({ nextRound, nextDesc }: SocketEvent["turn-updated"]) => {
      updatePeerConnection(nextDesc, nextRound, storePlayers);
      updateRoundAndDescriber(nextDesc, nextRound);
    },
    [storePlayers, updatePeerConnection, updateRoundAndDescriber]
  );
  useRegisterSocketListener("turn-updated", turnUpdatedListener);

  const playerLeftListener = useCallback(
    ({
      nextDesc,
      nextRound,
      remainingPlayers,
      disconnectingPlayer,
    }: SocketEvent["player-left"]) => {
      setPlayers(remainingPlayers);
      if (nextDesc !== undefined && nextRound !== undefined) {
        updatePeerConnection(nextDesc, nextRound, remainingPlayers);
        updateRoundAndDescriber(nextDesc, nextRound);
      }
      destroyPlayerPeerConnection(disconnectingPlayer.id);
    },
    [
      destroyPlayerPeerConnection,
      setPlayers,
      updatePeerConnection,
      updateRoundAndDescriber,
    ]
  );
  useRegisterSocketListener("player-left", playerLeftListener);

  const gameOverListener = useCallback(
    (players: SocketEvent["game-over"]) => {
      const numberOfPlayers = Object.keys(players).length;
      const win =
        numberOfPlayers === 1
          ? true
          : players[user!.id].rank <= Math.ceil(numberOfPlayers / 2);
      const advanced = level === "hard";
      const data = { win, advanced };

      if (mode === "standard") {
        updateStats(data);
      }
      destroyPeerConnection();
      setTimeout(() => {
        clearMessages();
        router.push("/dashboard");
      }, 3000);
    },
    [
      clearMessages,
      destroyPeerConnection,
      level,
      mode,
      router,
      updateStats,
      user,
    ]
  );
  useRegisterSocketListener("game-over", gameOverListener);
};
