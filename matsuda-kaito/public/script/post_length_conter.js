const countLength = document.getElementById('tsueeet-text');
const showLength = document.getElementById('count-text');

countLength.addEventListener('input', () => {
    const counted = countLength.value.length;
    showLength.textContent = `現在${counted}文字`;
});