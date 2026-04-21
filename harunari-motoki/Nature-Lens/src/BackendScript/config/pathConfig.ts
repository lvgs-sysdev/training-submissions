import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PATH = {
  CLIENTSIDE_SCRIPT: path.join(__dirname, "../../FrontendScript/"),
  INDEX_HTML: path.join(__dirname, "../../../index.html"),
};
