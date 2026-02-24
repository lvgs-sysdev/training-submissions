async function checkLogin() {
    try{
        const response = await fetch('http://localhost:3000/me' , {
            credentials: 'include'
        });
        const auth = await response.json();

        const postArea = document.getElementById('post-area');
        const loginMessage = document.getElementById('login-message');
        const loginLink = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (auth.loggedIn) {
            console.log("ようこそ、" + auth.user.user_name + "さん");

            if(postArea)postArea.style.display = 'block';
            if(loginMessage) loginMessage.style.display = 'none';
            if(loginLink) loginLink.style.display = 'none';
            if(logoutBtn) logoutBtn.style.display = 'inline';
        } else {
                console.log("未ログイン状態です");

                if(postArea) postArea.style.display = 'none';
                if (loginMessage) loginMessage.style.display = 'block';
                if(loginLink) loginLink.style.display = 'inline';
                if(logoutBtn) logoutBtn.style.display = 'none';
            }
        } catch (err) {
            console.error("通信エラー:", err);
        }
    }

checkLogin();


async function loadArticles() {
    try{
    const response = await fetch('http://localhost:3000/');
    const posts = await response.json();
    const container = document.getElementById('post-container');
    container.innerHTML = '';

    posts.forEach((post) => {
        const article = document.createElement('article');
        const imageSrc = post.image_path
            ? `/uploads/${post.image_path}`
            : `/images/default-thumbnail.png`;

        article.className = 'main-container';

        article.innerHTML = `
        <img class="main-container-img" src="${imageSrc}" alt="サムネイル">
        <small>投稿者: ${post.user_id}</small>
        <small class="main-container-date">${new Date(post.updated_at).toLocaleDateString()}</small>
        <h3 class="main-container-title"> ${post.article_title} </h3>
        <p class="main-container-text"> ${post.content}</p>
        <a href="detail.html?id=${post.id}">この記事を詳しく読む</a>
        `;
        container.appendChild(article);
    });
    } catch (err) {
        console.error('記事の読み込みに失敗しました',err);
        alert('記事の読み込みに失敗しました');
    }
};

loadArticles();

document.querySelector('#logout-btn').addEventListener('click' , async () => {
    try{
        const response = await fetch('http://localhost:3000/logout' , {
            method: 'POST',
            credentials: 'include'
        });

        if(response.ok) {
            alert("ログアウトに成功しました。");
            window.location.href = './login.html';
        }
    } catch (err) {
        console.error("ログアウト失敗" , err);
    }
});
