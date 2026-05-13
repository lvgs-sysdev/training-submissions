import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PATH = {
  VITE_FRONTEND: path.join(__dirname, "../../viteFrontend"),
  INDEX_HTML: path.join(__dirname, "../../viteFrontend/index.html"),
};
