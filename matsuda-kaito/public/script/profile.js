// プロフィール画像を確認させる
const getJson = () => {
    fetch('http://127.0.0.1:3001/profileData')
    .then(response => response.json())
    .then(userData => {
        const nowPhoto = document.getElementById('profileIcon');
        nowPhoto.src = userData.userDataRows[0].profile_icon;
        const nowUsername = document.querySelector('#showUsername');
        nowUsername.textContent = `現在のユーザネーム：${userData.userDataRows[0].username}`;
    })
}

getJson();

// ユーザーネームに関するバリデーション
const checkUsername = document.getElementById('editUsername');

checkUsername.addEventListener('input', () => {
    const alertUsername = document.querySelector('.alert-username');

    if (!checkUsername.value.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
        alertUsername.classList.add('is-show');
    } else {
        alertUsername.classList.remove('is-show');
    }
});


// 自己紹介に関するバリデーション
const countLength = document.getElementById('bio');
const showLength = document.getElementById('count-text');

countLength.addEventListener('input', () => {
    const counted = countLength.value.length;
    showLength.textContent = `現在${counted}文字`;

    const alertBio = document.querySelector('.alert-bio');

    if (counted > 100) {
        alertBio.classList.add('is-show');
    } else {
        alertBio.classList.remove('is-show');
    }
});