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

const countLength = document.getElementById('bio');
const showLength = document.getElementById('count-text');

countLength.addEventListener('input', () => {
    const counted = countLength.value.length;
    showLength.textContent = `現在${counted}文字`;
});