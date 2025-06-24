window.addEventListener('load', () => {
    var navLinks = document.querySelectorAll('nav a');
    if (navLinks.length >= 4) {
        navLinks[0].style.color = 'red';
        navLinks[1].style.color = 'blue';
        navLinks[2].style.color = 'gold';
        navLinks[3].style.color = 'green';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    alert('ようこそ！');

    const title = document.querySelector('h1');
    if (title) {
        setInterval(() => {
            title.style.transition = 'transform 1s';
            title.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                title.style.transition = 'none';
                title.style.transform = 'rotate(0deg)';
            }, 1000);
        }, 3000);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 記事タイトルのアニメーション
    const articleList = document.getElementById('article-list');
    if (articleList) {
        // liではなくdivになっているのでdivで取得
        const articleDivs = articleList.querySelectorAll('div');
        if (articleDivs.length >= 3) {
            // 1番目と3番目のタイトルa要素を取得
            const firstTitle = articleDivs[0].querySelector('a');
            const thirdTitle = articleDivs[2].querySelector('a');
            // アニメーション（例：色を交互に変える）
            setInterval(() => {
                if (firstTitle) {
                    firstTitle.style.transition = 'color 0.5s, font-size 0.5s';
                    firstTitle.style.color = firstTitle.style.color === 'deeppink' ? '' : 'deeppink';
                    firstTitle.style.fontSize = firstTitle.style.fontSize === '1.5em' ? '' : '1.5em';
                }
                if (thirdTitle) {
                    thirdTitle.style.transition = 'color 0.5s, font-size 0.5s';
                    thirdTitle.style.color = thirdTitle.style.color === 'limegreen' ? '' : 'limegreen';
                    thirdTitle.style.fontSize = thirdTitle.style.fontSize === '1.5em' ? '' : '1.5em';
                }
            }, 1200);
        }
    }
});