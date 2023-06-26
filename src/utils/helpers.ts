import Compressor from "compressorjs";
import { Socket } from "socket.io-client";

export const compress = (
  file: File | Blob,
  options: {
    maxWidth: number;
  }
) => {
  return new Promise<File | Blob>((resolve, reject) => {
    new Compressor(file, {
      ...options,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const emitSocketEvent = <T extends keyof SocketEvent>(
  socket: Socket | null,
  event: T,
  data?: SocketEvent[T]
) => {
  console.log(`%c<--- ${event}`, "color: #4109de; font-weight: 600", data);
  socket?.emit(event, data);
};

export const getSafeUser = (rawUser: any) => {
  const { _id: id, username, avatar, total, win, advanced } = rawUser;
  return { id, username, avatar, total, win, advanced };
};
