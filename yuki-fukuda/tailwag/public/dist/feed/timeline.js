import { setupPostForm } from "./post.js";
import { createPostCardHtml, updateImageCounter } from "./components.js";
// --- 1. 状態管理用の変数 ---
let allBreeds = [];
export let selectedBreeds = [];
// 犬種選択のリセット
export const clearSelectedBreeds = () => {
    selectedBreeds = [];
    const tagsContainer = document.getElementById("selected-breeds-tags");
    if (tagsContainer)
        tagsContainer.innerHTML = "";
};
// --- 2. 犬種読み込みと検索機能 ---
const loadBreeds = async () => {
    const token = localStorage.getItem("token");
    const datalist = document.getElementById("breed-options");
    if (!datalist)
        return;
    try {
        const response = await fetch("/api/breeds", {
            headers: { Authorization: `Bearer ${token}` },
        });
        allBreeds = await response.json();
        datalist.innerHTML = allBreeds
            .map((b) => `<option value="${b.name}">`)
            .join("");
        setupBreedSearch();
    }
    catch (err) {
        console.error("犬種リストの取得失敗:", err);
    }
};
const setupBreedSearch = () => {
    const input = document.getElementById("breed-search-input");
    if (!input)
        return;
    input.oninput = () => {
        const val = input.value;
        const breed = allBreeds.find((b) => b.name === val);
        if (breed && !selectedBreeds.some((s) => s.id === breed.id)) {
            selectedBreeds.push(breed);
            renderBreedTags();
            input.value = "";
        }
    };
};
const renderBreedTags = () => {
    const tagsContainer = document.getElementById("selected-breeds-tags");
    if (!tagsContainer)
        return;
    tagsContainer.innerHTML = selectedBreeds
        .map((b) => `
      <span class="breed-tag-badge">
        # ${b.name} 
        <span class="remove-tag" data-id="${b.id}">×</span>
      </span>
    `)
        .join("");
    tagsContainer.querySelectorAll(".remove-tag").forEach((el) => {
        const span = el;
        span.onclick = () => {
            const id = Number(span.getAttribute("data-id"));
            selectedBreeds = selectedBreeds.filter((b) => b.id !== id);
            renderBreedTags();
        };
    });
};
// --- 3. 初期化処理 ---
export const initTimeline = async (containerId) => {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    try {
        const response = await fetch("/feed/timeline.html");
        container.innerHTML = await response.text();
        setupPostForm();
        setupNavigation();
        setupSearch();
        await loadBreeds();
        await refreshTimeline();
    }
    catch (error) {
        console.error("タイムライン初期化エラー：", error);
        container.innerHTML = "<p>読み込みに失敗しました🐾</p>";
    }
};
// --- 4. データの取得と反映 ---
export const refreshTimeline = async (searchWord) => {
    const token = localStorage.getItem("token");
    const listContainer = document.getElementById("posts-list");
    if (listContainer)
        listContainer.innerHTML = "<p>わんこを探しています...</p>";
    try {
        let url = "/api/posts";
        if (searchWord) {
            const params = new URLSearchParams();
            params.append("search", searchWord);
            url += `?${params.toString()}`;
        }
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (listContainer) {
            if (Array.isArray(data) && data.length === 0 && searchWord) {
                listContainer.innerHTML = `<p>「${searchWord}」に一致する投稿は見つかりませんでした🐾</p>`;
            }
            else {
                renderPosts(Array.isArray(data) ? data : [], listContainer);
            }
        }
    }
    catch (error) {
        console.error("取得エラー:", error);
    }
};
export const renderPosts = (posts, container, isGrid = false) => {
    if (!container)
        return;
    if (!Array.isArray(posts) || posts.length === 0) {
        container.innerHTML = "<p>投稿が見つかりませんでした🐾</p>";
        return;
    }
    container.classList.toggle("post-grid", isGrid);
    // 💡 コンポーネント関数を使って HTML を生成
    container.innerHTML = posts.map((post) => createPostCardHtml(post)).join("");
    setupLikeButtons();
    setupUserClickEvents(container);
    setupPostModalEvents(container, posts);
    // 💡 共通のカウンター更新イベントを登録
    container.querySelectorAll(".post-image-wrapper").forEach((el) => {
        const wrapper = el;
        wrapper.addEventListener("scroll", () => updateImageCounter(wrapper), {
            passive: true,
        });
    });
};
// --- 5. モーダル関連 ---
const setupPostModalEvents = (container, posts) => {
    container.querySelectorAll(".post-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".like-btn") ||
                e.target.closest(".user-name"))
                return;
            const postId = Number(card.getAttribute("data-post-id"));
            const targetPost = posts.find((p) => p.id === postId);
            if (targetPost)
                openPostModal(targetPost);
        });
    });
};
const openPostModal = (post) => {
    const modal = document.getElementById("post-modal");
    const modalDetail = document.getElementById("modal-post-detail");
    if (!modal || !modalDetail)
        return;
    // 💡 ここでもコンポーネント関数を使用 (isModal引数をtrueに)
    modalDetail.innerHTML = createPostCardHtml(post, true);
    modal.style.display = "flex";
    setupLikeButtons();
    setupUserClickEvents(modalDetail);
    // モーダル内のカウンターイベント
    const modalWrapper = modalDetail.querySelector(".post-image-wrapper");
    if (modalWrapper && post.image_urls.length > 1) {
        modalWrapper.addEventListener("scroll", () => updateImageCounter(modalWrapper), { passive: true });
    }
    document.getElementById("close-modal").onclick = () => {
        modal.style.display = "none";
    };
    modal.onclick = (e) => {
        if (e.target === modal)
            modal.style.display = "none";
    };
};
// --- 6. ナビゲーション・検索・いいね ---
export const setupNavigation = () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("token");
            location.reload();
        };
    }
    const mypageBtn = document.getElementById("to-mypage");
    if (mypageBtn) {
        mypageBtn.onclick = async (e) => {
            e.preventDefault();
            const { initMypage } = await import("../../mypage/mypage.js");
            initMypage();
        };
    }
    const homeBtn = document.getElementById("to-home");
    if (homeBtn) {
        homeBtn.onclick = () => {
            refreshTimeline();
            window.scrollTo(0, 0);
        };
    }
};
export const setupSearch = () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    if (!searchInput || !searchBtn)
        return;
    const doSearch = () => {
        const word = searchInput.value.trim();
        refreshTimeline(word || undefined);
    };
    searchBtn.onclick = (e) => {
        e.preventDefault();
        doSearch();
    };
    searchInput.onkeydown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            doSearch();
        }
    };
};
const setupLikeButtons = () => {
    document.querySelectorAll(".like-btn").forEach((el) => {
        const btn = el;
        btn.onclick = async (e) => {
            e.stopPropagation();
            const postId = btn.getAttribute("data-post-id");
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`/api/posts/${postId}/like`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const result = await response.json();
                    btn.querySelector(".like-icon").innerHTML = result.liked
                        ? "❤️"
                        : "🐾";
                    btn.querySelector(".like-count").innerHTML = result.count;
                    btn.classList.toggle("is-liked", result.liked);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
    });
};
const setupUserClickEvents = (container) => {
    container.querySelectorAll(".user-name").forEach((el) => {
        const span = el;
        span.onclick = async (e) => {
            e.stopPropagation();
            const userId = Number(span.getAttribute("data-user-id"));
            const { initMypage } = await import("../../mypage/mypage.js");
            initMypage(userId);
        };
    });
};
//# sourceMappingURL=timeline.js.map