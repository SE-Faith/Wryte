import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket = null;

export const getSocket = (userId) => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  }

  if (!socket.connected) {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket client connected!");
      if (userId) {
        socket.emit("join", userId);
      }
    });
  } else if (userId) {
    socket.emit("join", userId);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
    console.log("Socket client disconnected");
  }
};
