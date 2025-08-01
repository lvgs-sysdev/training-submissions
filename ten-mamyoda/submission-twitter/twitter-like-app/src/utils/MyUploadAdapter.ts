import axios from 'axios';

export default class MyUploadAdapter {
    private loader: any;
    private onSuccess: (url: string) => void;

    constructor(loader: any, onSuccess: (url: string) => void) {
        this.loader = loader;
        this.onSuccess = onSuccess;
    }

    async upload() {
        const data = new FormData();
        const file = await this.loader.file;
        data.append('upload', file);

        try {
            const res = await axios.post('/api/posts/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // アップロードされた相対パス
            const relativePath = res.data.imageUrl;

            // ✅ フルURLに変換（開発環境用に http://localhost:3000 を先頭に付加）
            const uploadedUrl = `http://localhost:3000${relativePath}`;

            this.onSuccess(uploadedUrl); // 成功時コールバック

            return {
                default: uploadedUrl, // CKEditorに返すURL
            };
        } catch (error) {
            console.error('画像アップロード失敗:', error);
            throw error;
        }
    }
}
