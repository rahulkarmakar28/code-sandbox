import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const writeCodeToFile = async (code: string, ext: string) => {
  const id = uuid();
  const filename = `${id}.${ext}`;
  const filePath = path.join(__dirname, "../../temp", filename);
  await fs.writeFile(filePath, code);
  return { filename, path: filePath };
};

const removeFile = async (filePath: string) => {
  await fs.unlink(filePath);
};

export { writeCodeToFile, removeFile }