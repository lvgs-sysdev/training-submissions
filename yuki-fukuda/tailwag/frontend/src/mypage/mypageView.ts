export const MypageView = {
  // プロフィール情報の描画
  renderProfile: (profile: any) => {
    const setText = (id: string, text: any) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(text);
    };

    setText("profile-name", profile.account_name);
    setText("profile-account-id", `@${profile.account_id}`);
    setText(
      "profile-content",
      profile.profile_content || "自己紹介はまだありません",
    );
    setText("following-count", profile.following_count);
    setText("followers-count", profile.followers_count);

    const profileImg = document.getElementById(
      "profile-img",
    ) as HTMLImageElement;
    if (profileImg && profile.profile_image_url) {
      const finalPath = profile.profile_image_url.startsWith("/")
        ? profile.profile_image_url
        : `/${profile.profile_image_url}`;
      profileImg.src = `${finalPath}?t=${new Date().getTime()}`;
    }
  },

  // 編集モーダルの初期値セットと表示
  showEditModal: (profile: any) => {
    (document.getElementById("edit-name") as HTMLInputElement).value =
      profile.account_name;
    (document.getElementById("edit-bio") as HTMLTextAreaElement).value =
      profile.profile_content || "";
    document.getElementById("edit-profile-modal")!.style.display = "flex";
  },

  // モーダルを閉じる
  hideEditModal: () => {
    const modal = document.getElementById("edit-profile-modal");
    if (modal) modal.style.display = "none";
  },

  // プレビュー画像の表示
  renderImagePreview: (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById(
        "preview-img",
      ) as HTMLImageElement;
      if (preview) {
        preview.src = e.target?.result as string;
        preview.style.display = "block";
      }
    };
    reader.readAsDataURL(file);
  },
};
