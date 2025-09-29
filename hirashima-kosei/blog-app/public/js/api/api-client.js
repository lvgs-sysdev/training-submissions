import { refreshAccessToken } from './auth.js';

// 標準で使用するAPIクライアント
export const apiClient = axios.create({
	baseURL: 'http://localhost:5050/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// リフレッシュ状態を管理
let isRefreshing = false;
// コールバック関数を管理
let subscribers = [];

// 待機中のリクエストを再実行
function onRrefreshed() {
	subscribers.map((cb) => cb());
	subscribers = [];
}

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response && !originalRequest.url.match('auth') && error.response.status === 401) {
			// リフレッシュ処理が進行中の場合、待機キューに追加してPromiseを返す
			if (isRefreshing) {
				return new Promise((resolve) => {
					subscribers.push(() => {
						// 新しいトークンでリトライする
						resolve(apiClient(originalRequest));
					});
				});
			}

			// リフレッシュ処理が開始されていない場合、処理を開始
			isRefreshing = true;
			try {
				// ここでリフレッシュトークンを使用して新しいアクセストークンを取得
				await refreshAccessToken();

				// 待機中の全てのリクエストをリトライさせる
				onRrefreshed();

				// 初めに401を発生させたリクエストをリトライ
				return apiClient(originalRequest);
			} catch (error) {
				isRefreshing = false;
				throw error.response ? error.response.data.error : '接続エラー';
			} finally {
				isRefreshing = false;
			}
		}

		throw error.response ? error.response.data.error : '接続エラー';
	}
);
