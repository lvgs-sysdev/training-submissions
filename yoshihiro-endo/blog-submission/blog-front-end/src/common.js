// HTMLが読み込まれたら（DOMが構築されたら）実行する
document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーとフッターを読み込む
    loadHTML('#header-placeholder', '../common-header.html');
    loadHTML('#footer-placeholder', '../common-footer.html');
});

/**
 * 指定された要素(selector)に、指定されたURL(url)のHTMLを読み込む関数
 */
async function loadHTML(selector, url) {
    try {
        // fetch を使ってHTMLファイルを取得
        const response = await fetch(url);
        
        // 取得が成功したかチェック
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        
        // HTMLの中身をテキストとして取得
        const htmlText = await response.text();
        
        // 目印となる要素(selector)を見つけて、その中身(innerHTML)を取得したHTMLで置き換える
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = htmlText;
        } else {
            console.warn(`Element with selector "${selector}" not found.`);
        }
        
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}