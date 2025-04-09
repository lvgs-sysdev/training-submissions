// 新規登録フォームのバリデーション
const signupForm = document.getElementById('signupForm');
const infoSubmit = document.getElementById('signupInformationSubmit');

// ユーザーネームは平仮名・カタカナ・漢字のみ許可
const username = document.getElementById('username');
username.addEventListener('input', () => {
    const alertUsername = document.querySelector('.alert-username');
    // // ひらがな・カタカナ・漢字のみ使用可
    if (!username.value.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
        alertUsername.classList.add('is-show');
    } else {
        alertUsername.classList.remove('is-show');
    }
});

// ログインIDは英数字のみ許可
const forValidation = /^[A-Za-z0-9]+$/;
const loginId = document.getElementById('loginId');
loginId.addEventListener('input', () => {
    const alertId = document.querySelector('.alert-id');

    if (!loginId.value.match(forValidation)) {
        alertId.classList.add('is-show');
    } else {
        alertId.classList.remove('is-show');
    }
});

// パスワードは大小英数字のみ許可
const forStrongValidation = /^(?=.*?[A-Za-z])(?=.*?[A-Z0-9])/;
const password = document.getElementById('firstPassword');
password.addEventListener('input', () => {
    const alertPassword = document.querySelector('.alert-firstPW');

    if (!password.value.match(forStrongValidation)) {
        alertPassword.classList.add('is-show');
    } else {
        alertPassword.classList.remove('is-show');
    }
});

// パスワードが同じか確認
const checkPassword = document.getElementById('secondPassword');
checkPassword.addEventListener('input', () => {
    const alertCheckPassword = document.querySelector('.alert-secondPW');

    if (password.value !== checkPassword.value) {
        alertCheckPassword.classList.add('is-show');
    } else {
        alertCheckPassword.classList.remove('is-show');
    }
});

// 全てのバリデーションをクリアした場合のみ送信ボタンをアクティブ化
signupForm.addEventListener('input', () => {
    // ひらがな・カタカナ・漢字のみ使用可
    if (username.value.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) &&
        loginId.value.match(forValidation) &&
        password.value.match(forStrongValidation) &&
        password.value === checkPassword.value) {
        infoSubmit.disabled = false;
    } else {
        infoSubmit.disabled = true;
    }
});