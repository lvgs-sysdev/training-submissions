// public/js/profile_edit.js

// DOMContentLoaded イベントリスナー: HTMLの読み込みが完了したらスクリプトを実行
document.addEventListener('DOMContentLoaded', () => {

    // === HTML要素の取得 ===
    // JavaScriptが操作するHTML要素を、ページの読み込み完了後に確実に取得
    const profileSaveForm = document.getElementById('profileSaveForm');
    const imageMessageDiv = document.getElementById('imageMessage');
    const profileImageInput = document.getElementById('profileImage');
    const currentProfileImageDisplay = document.querySelector('#user_img img'); // #user_img 内の img タグ
    const deleteCheckbox = document.getElementById('deleteProfileImage');
    const fileNameDisplay = document.getElementById('fileNameDisplay'); // ファイル名表示用 span

    // === 初期パスと状態の管理 ===
    // HTMLで定義された初期画像パスをwindowスコープから取得
    // もしパスが未定義かプレースホルダーのままなら、デフォルトの画像パスを使用
    const initialProfileImageSrc = (typeof window.initialProfileImageSrc !== 'undefined' && window.initialProfileImageSrc !== '@USER_IMG_SRC@')
        ? window.initialProfileImageSrc
        : '/image/profile/user-1.png';

    // ページロード時に表示されている画像を正確に記憶
    // currentProfileImageDisplay が存在し、そのsrcがサーバーによって置換済みであることを前提
    let originalDisplayImageSrc;
    if (currentProfileImageDisplay) {
        originalDisplayImageSrc = currentProfileImageDisplay.src.includes('@USER_IMG_SRC@')
            ? initialProfileImageSrc // まだプレースホルダーなら初期画像パスを使用
            : currentProfileImageDisplay.src; // 既に置換済みならそのパスを使用
    } else {
        originalDisplayImageSrc = initialProfileImageSrc; // imgタグ自体がない場合のフォールバック
    }

    // ユーザーがファイル選択で最後に選んだ画像のData URLとファイル名を一時的に保持
    let lastSelectedFileDataURL = null;
    let lastSelectedFileName = null;


    // === プロフィール保存フォームの処理 ===
    // フォーム要素が見つかった場合のみイベントリスナーを設定
    if (profileSaveForm) {
        profileSaveForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // フォームのデフォルト送信（ページ遷移）をキャンセル

            const form = event.target;
            const formData = new FormData(form); // フォーム内の全データ（テキスト、ファイル、チェックボックスなど）を取得

            try {
                // Fetch API でフォームデータを非同期でサーバーに送信
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                });

                // サーバーがリダイレクトを指示した場合、すぐにページを移動
                if (response.redirected) {
                    window.location.href = response.url;
                    return;
                }

                const result = await response.json(); // サーバーからのJSONレスポンスを解析

                // サーバーからのレスポンスがエラー (HTTPステータスが2xx以外) の場合
                if (!response.ok) {
                    if (imageMessageDiv) {
                        imageMessageDiv.textContent = 'Error: ' + (result.error || result.message || 'Failed to save profile.');
                        imageMessageDiv.style.color = 'red';
                    }
                }
                // 成功時のメッセージは不要（リダイレクトされるため）

            } catch (error) { // ネットワークエラーなど、サーバーにリクエストが届かなかった場合
                console.error('Profile save error:', error); // 開発者向けにエラーをログ
                if (imageMessageDiv) {
                    imageMessageDiv.textContent = 'Error: Network error occurred.';
                    imageMessageDiv.style.color = 'red';
                }
            }
        });
    } else {
        console.error('Error: profileSaveForm element not found during DOMContentLoaded! Check HTML ID.');
    }


    // === ファイル選択時に即時プレビューを表示する機能 ===
    // ファイル入力要素が見つかった場合のみイベントリスナーを設定
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function (event) {
            const file = event.target.files[0]; // 選択されたファイル（配列の最初の要素）

            if (file) { // ファイルが選択された場合
                // ファイルが選択されたら「画像を削除」チェックボックスをオフに
                if (deleteCheckbox) {
                    deleteCheckbox.checked = false;
                }

                const reader = new FileReader(); // FileReaderオブジェクトを作成
                reader.onload = function (e) { // ファイルの読み込みが完了したら実行
                    if (currentProfileImageDisplay) {
                        currentProfileImageDisplay.src = e.target.result; // メイン画像表示要素にプレビュー画像をセット
                    }
                    // 最後に選択されたファイルの情報として、Data URLとファイル名を記憶
                    lastSelectedFileDataURL = e.target.result;
                    lastSelectedFileName = file.name;
                };
                reader.readAsDataURL(file); // 選択されたファイルをData URL形式で読み込む

                // ファイル名表示要素にファイル名を表示
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = file.name;
                }
            } else { // ファイルが選択されていない場合（ファイル選択ダイアログをキャンセルしたなど）
                // 選択状態をリセット
                lastSelectedFileDataURL = null;
                lastSelectedFileName = null;

                // メイン画像を元の状態に戻す
                if (currentProfileImageDisplay) {
                    currentProfileImageDisplay.src = originalDisplayImageSrc; // ページロード時の画像に戻す
                }
                // ファイル名表示を「No file chosen」にリセット
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'No file chosen';
                }
            }
        });
    } else {
        console.error('Error: profileImageInput element not found during DOMContentLoaded! Check HTML ID.');
    }


    // === 「画像を削除」チェックボックスのイベントリスナー ===
    // チェックボックス要素が見つかった場合のみイベントリスナーを設定
    if (deleteCheckbox) {
        deleteCheckbox.addEventListener('change', function (event) {
            const deleteChecked = event.target.checked; // チェックボックスの現在のチェック状態（true/false）を取得

            if (deleteChecked) { // チェックボックスが「オン」になった場合（画像を削除する意図）
                profileImageInput.value = ''; // ファイル入力フィールドの選択をクリア
                lastSelectedFileDataURL = null; // 新しいファイルの選択状態もリセット
                lastSelectedFileName = null;

                // メイン画像をデフォルト画像に変更
                if (currentProfileImageDisplay) {
                    currentProfileImageDisplay.src = '/image/profile/user-1.png'; // デフォルト画像のパスを設定
                }
                // ファイル名表示をリセット
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'No file chosen';
                }
            } else { // チェックボックスが「オフ」になった場合（画像を削除しない意図）
                // ユーザーが以前に新しいファイルをプレビューしていたかチェック
                if (lastSelectedFileDataURL) {
                    // もし新しいファイルを最後に選んでいたなら、そのプレビュー画像に戻す
                    if (currentProfileImageDisplay) {
                        currentProfileImageDisplay.src = lastSelectedFileDataURL;
                    }
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = lastSelectedFileName;
                    }
                } else {
                    // 新しいファイルを選択していなかったら、ページロード時の元の画像に戻す
                    if (currentProfileImageDisplay) {
                        currentProfileImageDisplay.src = originalDisplayImageSrc;
                    }
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = 'No file chosen';
                    }
                }
            }
        });
    } else {
        console.error('Error: deleteProfileImage element not found during DOMContentLoaded! Check HTML ID.');
    }

    // === ページロード時の初期設定 ===
    // ページが読み込まれたときの初期状態を設定
    if (fileNameDisplay) {
        fileNameDisplay.textContent = 'No file chosen'; // 最初にファイル名表示を「No file chosen」にする
    }
    if (imageMessageDiv) {
        imageMessageDiv.textContent = ''; // 最初にメッセージ表示領域を空にする
    }

}); // DOMContentLoaded イベントリスナーの終了