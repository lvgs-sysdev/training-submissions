async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id') || '1'; // テスト用

    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) throw new Error('ユーザーが見つかりません');
        
        const user = await response.json();

        document.getElementById('user-name').textContent = user.user_name;
        document.getElementById('display-user-id').textContent = userId;
        document.getElementById('user-bio').textContent = user.bio || "まだ自己紹介がありません。";
        
        const date = new Date(user.created_at);
        document.getElementById('joined-date').textContent = date.toLocaleDateString('ja-JP');

        if (user.profile_image) {
            document.getElementById('user-avatar').src = `images/${user.profile_image}`;
        }
    } catch (error) {
        console.error(error);
        alert("プロフィールの読み込みに失敗しました。");
    }
}

loadProfile();