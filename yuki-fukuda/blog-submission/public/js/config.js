const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal
  ? "https://localhost:3000"
  : "https://api.your-produciton.com";
