import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const memory = process.env.DOCKER_MEMORY_LIMIT || "256m";
const cpu = process.env.DOCKER_CPU_LIMIT || "0.5";
const pidsLimit = process.env.DOCKER_PIDS_LIMIT || 64;
type fileType = {
  filename: string;
  path: string;
};

type configType = {
  image: string;
  ext: string;
  cmd: (filename: string) => string;
};

export const executeCode = async (file: fileType, config: configType) => {
  const originalPath = file.path;
  const tempDir = path.dirname(originalPath).replace(/\\/g, "/");
  const containerName = `sandbox-${file.filename.split(".")[0]}`;
  let filename = file.filename;

  if (config.ext === "java") {
    const mainPath = path.join(tempDir, "Main.java");
    await fs.rename(originalPath, mainPath);
    filename = "Main.java";

    file.path = mainPath;
    file.filename = "Main.java";
  }

  const fullCommand = config.cmd(filename);
  const dockerCmd = `timeout 180 docker run --rm \
    --name ${containerName} \
    -v "${tempDir}:/app" \
    --network none \
    --memory=${memory} --cpus=${cpu} \
    --pids-limit=64${pidsLimit} \
    --read-only \
    ${config.image} "${fullCommand}"`;

  return new Promise((resolve) => {
    exec(dockerCmd, (err, stdout, stderr) => {
      resolve({
        output: stdout,
        error: err ? stderr || err.message : null,
      });
    });
  });
};
