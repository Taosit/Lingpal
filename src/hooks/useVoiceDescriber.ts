import { useSocketContext } from "@/contexts/SocketContext";
import { useGameStore } from "@/stores/GameStore";
import { useSettingStore } from "@/stores/SettingStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Peer from "simple-peer";
import { useIsUserDescriber } from "./useIsUserDescriber";
import { useAuthStore } from "@/stores/AuthStore";

export const useVoiceDescriber = () => {
  const describerMethod = useSettingStore((store) => store.settings.describer);
  const players = useGameStore((store) => store.players);
  const userId = useAuthStore((store) => store.user?.id);
  const { socket } = useSocketContext();

  const describerAudio = useRef(new Audio());
  const [receivingPeers, setReceivingPeers] = useState<
    Record<string, Peer.Instance>
  >({});
  const [sendingPeer, setSendingPeer] = useState<Peer.Instance | null>(null);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const playerArray = useMemo(
    () =>
      Object.values(players).sort(
        (player1, player2) => player1.order - player2.order
      ),
    [players]
  );

  const isUserDescriber = useIsUserDescriber();

  useEffect(() => {
    if (describerMethod !== "voice") return;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        setIsMuted(false);
        setUserStream(stream);
      });
  }, [describerMethod]);

  const mute = useCallback(() => {
    if (!userStream) return;
    userStream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
    setIsMuted(true);
  }, [userStream]);

  const unmute = useCallback(() => {
    if (!userStream) return;
    userStream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    setIsMuted(false);
  }, [userStream]);

  const destroyPeers = useCallback(() => {
    if (sendingPeer) {
      sendingPeer.destroy();
      setSendingPeer(null);
    }
    Object.values(receivingPeers).forEach((peer) => peer.destroy());
    setReceivingPeers({});
  }, [receivingPeers, sendingPeer]);

  const createPeer = useCallback(
    (id: string, stream: MediaStream) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket?.emit("voice-stream", {
          receiverId: id,
          signal,
        });
      });

      return peer;
    },
    [socket]
  );

  const createPeers = useCallback(() => {
    if (!userStream) return;
    const voicePeers = playerArray
      .filter((p) => p.id !== userId)
      .reduce((peers, player) => {
        const peer = createPeer(player.id, userStream);
        peers[player.id] = peer;
        return peers;
      }, {} as Record<string, Peer.Instance>);
    return voicePeers;
  }, [createPeer, playerArray, userId, userStream]);

  useEffect(() => {
    if (!socket) return;
    if (describerMethod !== "voice") return;
    if (isUserDescriber) {
      const peers = createPeers();
      if (!peers) return;
      setReceivingPeers(peers);
      socket.on("receive-return-signal", ({ receiverId, signal }) => {
        const peer = peers[receiverId];
        peer.signal(signal);
      });
    } else {
      socket.on("receive-voice-stream", ({ senderId, signal }) => {
        const peer = new Peer({
          initiator: false,
          trickle: false,
        });
        describerAudio.current.autoplay = true;
        peer.signal(signal);
        peer.on("signal", (signal) => {
          socket?.emit("return-signal", {
            senderId,
            signal,
          });
        });
        peer.on("stream", (stream) => {
          describerAudio.current.srcObject = stream;
        });
        setSendingPeer(peer);
      });
    }

    return () => {
      socket.off("receive-return-signal");
      socket.off("receive-voice-stream");
    };
  }, [createPeers, describerMethod, isUserDescriber, socket]);

  return {
    mute,
    unmute,
    isMuted,
    destroyPeers,
  };
};
