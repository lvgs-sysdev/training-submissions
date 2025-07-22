export interface GenericServerError {
  message: string;
  code: string; // 例: "INTERNAL_SERVER_ERROR", "UNAUTHORIZED"
  details?: string; // 例: スタックトレースなど（開発環境のみ）
}
