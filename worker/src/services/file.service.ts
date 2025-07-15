import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

// Define base temp directory
const baseTempDir = path.join(__dirname, "../../temp");



/*
 * Creates a room directory if it doesn't exist
 */
const ensureRoomDir = async (roomId: string) => {
  const roomPath = path.join(baseTempDir, roomId);
  await fs.mkdir(roomPath, { recursive: true });
  return roomPath;
};

/*
 * Writes code into a new file under the room directory
 */
const writeCodeToRoom = async (code: string, ext: string, roomId: string) => {
  const roomDir = await ensureRoomDir(roomId);
  const filename = `${uuid()}.${ext}`;
  const filePath = path.join(roomDir, filename);
  await fs.writeFile(filePath, code);
  return { filename, path: filePath };
};

/*
 * Deletes an entire room directory
 */
const deleteRoom = async (roomId: string) => {
  const roomPath = path.join(baseTempDir, roomId);
  await fs.rm(roomPath, { recursive: true, force: true });
};

export { writeCodeToRoom, deleteRoom };
