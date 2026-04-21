let _accessToken: string | null = null;

export const authService = {
  setAccessToken: (token: string) => {
    _accessToken = token;
    console.log("Access Tokenをメモリに保存しました", _accessToken);
  },
  getAccessToken: () => {
    console.log(_accessToken);
    return _accessToken;
  },
  clearAccessToken: () => {
    _accessToken = null;
  },
};
