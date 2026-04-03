import { renderPosts } from "../feed/timeline.js";
import { setupNavigation } from "../feed/timeline.js";
export const initMypage = async () => {
    const mainContainer = document.querySelector(".app-container");
    if (!mainContainer)
        return;
    try {
        //HTMLテンプレートの読み込み、表示
        const htmlRes = await fetch("/mypage/mypage.html");
        mainContainer.innerHTML = await htmlRes.text();
        //バックエンドからデータを取得
        const token = localStorage.getItem("token");
        const response = await fetch("/mypage", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok)
            throw new Error("データの取得に失敗しました");
        const data = await response.json();
        //プロフィール情報を反映
        document.getElementById("profile-name").textContent =
            data.profile.account_name;
        document.getElementById("profile-account-id").textContent =
            `@${data.profile.account_id}`;
        document.getElementById("profile-content").textContent =
            data.profile.profile_content || "自己紹介はまだありません";
        document.getElementById("following-count").textContent =
            data.profile.following_count;
        document.getElementById("followers-count").textContent =
            data.profile.followers_count;
        if (data.profile.profile_image) {
            document.getElementById("profile-img").src =
                data.profile.profile_image;
        }
        const postsContainer = document.getElementById("posts-container");
        if (postsContainer && data.posts) {
            renderPosts(data.posts, postsContainer, true);
        }
    }
    catch (error) {
        console.error(error);
        mainContainer.innerHTML = "<p>読み込みに失敗しました。</p>";
    }
    setupNavigation();
    const homeBtn = document.getElementById("to-home");
    if (homeBtn) {
        homeBtn.onclick = () => {
            location.reload();
        };
    }
};
//# sourceMappingURL=mypage.js.map