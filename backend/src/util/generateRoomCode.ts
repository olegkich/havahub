import * as crypto from "node:crypto";

export const generateRoomCode = (): string => {
  return crypto.randomBytes(6).toString("hex");
};
