//外部から直接さわれないようにファイルのトップレベルで変数を定義
// これがインメモリ保存　インメモリ保存については別途調べる
let _accessToken: string | null = null;

export const authService = {
  // アクセストークンを金庫に保存する
  setAccessToken: (token: string) => {
    _accessToken = token;
    console.log("Access Tokenをメモリに保存しました", _accessToken);
  },
  //アクセストークンを取り出す処理
  getAccessToken: () => {
    console.log(_accessToken);
    return _accessToken;
  },
  //ログアウト時になどに中身を空にする
  clearAccessToken: () => {
    _accessToken = null;
  },
};
