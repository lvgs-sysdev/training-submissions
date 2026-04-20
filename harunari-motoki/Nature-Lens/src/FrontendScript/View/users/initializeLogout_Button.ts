import { router } from "../../EntryPoint.ts";
import { logoutTrafficControll } from "../../Services/users/logoutTrafficControll.ts";

export const initializeLogout_Button = async () => {
  const logout_Button = document.querySelector(".logout_button");

  if (!logout_Button) {
    console.error("no such a button.");
    throw new Error("no such a button.");
  } else {
    console.log("ログアウトボタン検知前");
    logout_Button.addEventListener("click", async () => {
      try {
        //リフレッシュトークンとアクセストークンの削除
        const response = await logoutTrafficControll();
        console.log(
          "リフレッシュトークンとアクセストークンの削除結果",
          response.status,
        );

        window.history.pushState({ page: "toppage" }, "", "/");
        router();
        alert("ログアウトしました！");
      } catch (error) {
        console.error("ログアウト処理に失敗しました", error);
        alert("ログアウト処理に失敗しました");
      }
    });
  }
};
