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

  const describerAudio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("") : undefined
  );
  const [receivingPeers, setReceivingPeers] = useState<
    Record<string, Peer.Instance>
  >({});
  const [sendingPeer, setSendingPeer] = useState<Peer.Instance | null>(null);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  const destroyPeerConnection = useCallback(() => {
    socket?.off("receive-voice-stream");
    socket?.off("receive-return-signal");
    if (sendingPeer) {
      sendingPeer.destroy();
      setSendingPeer(null);
    }
    Object.values(receivingPeers).forEach((peer) => peer.destroy());
    setReceivingPeers({});
  }, [receivingPeers, sendingPeer, socket]);

  const destroyPlayerPeerConnection = useCallback(
    (id: string) => {
      const peer = receivingPeers[id];
      if (!peer) return;
      peer.destroy();
      delete receivingPeers[id];
      setReceivingPeers({ ...receivingPeers });
    },
    [receivingPeers]
  );

  const createPeer = useCallback(
    (id: string, stream: MediaStream) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        console.log("%c<--- voice-stream", "color: #4109de; font-weight: 600");
        socket?.emit("voice-stream", {
          receiverId: id,
          signal,
        });
      });

      return peer;
    },
    [socket]
  );

  const createPeers = useCallback(
    (players: Record<string, Player>) => {
      if (!userStream) return;
      const voicePeers = Object.values(players)
        .filter((p) => p.id !== userId)
        .reduce((peers, player) => {
          const peer = createPeer(player.id, userStream);
          peers[player.id] = peer;
          return peers;
        }, {} as Record<string, Peer.Instance>);
      return voicePeers;
    },
    [createPeer, userId, userStream]
  );

  const initiatePeerConnection = useCallback(
    (players: Record<string, Player>) => {
      const peers = createPeers(players);
      if (!peers) return;
      setReceivingPeers(peers);
      socket?.on("receive-return-signal", ({ receiverId, signal }) => {
        console.log(
          "%c---> receive-return-signal",
          "color: #039c13; font-weight: 600"
        );
        setIsLoading(false);
        const peer = peers[receiverId];
        peer.signal(signal);
      });
    },
    [createPeers, socket]
  );

  const acceptPeerConnection = useCallback(() => {
    socket?.on("receive-voice-stream", ({ senderSocketId, signal }) => {
      console.log(
        "%c---> receive-voice-stream",
        "color: #039c13; font-weight: 600"
      );
      const peer = new Peer({
        initiator: false,
        trickle: false,
      });
      if (describerAudio.current) {
        describerAudio.current.autoplay = true;
      }
      peer.signal(signal);
      peer.on("signal", (signal) => {
        console.log("%c<--- return-signal", "color: #4109de; font-weight: 600");
        socket?.emit("return-signal", {
          senderSocketId,
          signal,
        });
      });
      peer.on("stream", (stream) => {
        if (describerAudio.current) {
          describerAudio.current.srcObject = stream;
        }
      });
      setSendingPeer(peer);
    });
  }, [socket]);

  const firstMount = useRef(true);

  useEffect(() => {
    if (!socket) return;
    if (describerMethod !== "voice") return;
    if (!userStream) return;
    if (!firstMount.current) return;
    firstMount.current = false;

    if (isUserDescriber) {
      initiatePeerConnection(players);
    } else {
      acceptPeerConnection();
    }
  }, [
    acceptPeerConnection,
    describerMethod,
    initiatePeerConnection,
    isUserDescriber,
    players,
    socket,
    userStream,
  ]);

  return {
    mute,
    unmute,
    isMuted,
    isLoading,
    initiatePeerConnection,
    acceptPeerConnection,
    destroyPeerConnection,
    destroyPlayerPeerConnection,
  };
};
