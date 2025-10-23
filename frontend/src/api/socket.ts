import { io } from "socket.io-client";

const API_URL = import.meta.env.PROD
  ? "" // empty string → same origin
  : "http://localhost:10000";

export const socket = io(API_URL); // adjust URL for production
