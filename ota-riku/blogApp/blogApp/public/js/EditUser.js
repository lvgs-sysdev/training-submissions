// 入力チェックと変更処理
const editForm = document.getElementById("edit-user-form");
const errorMsgElem = document.getElementById("error-msg");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // パスワード確認入力一致チェック
  //　入力欄と確認入力欄を取ってくる
  const userIdElem = document.getElementById("user_id");
  const usernameElem = document.getElementById("user_name");

  errorMsgElem.innerHTML = "";

  // 入力が空の場合
  if (userIdElem.value == "" || usernameElem.value == "") {
    if (userIdElem.value == "") {
      CreateErrorMsgElem("ユーザIDを入力してください。");
    }
    if (usernameElem.value == "") {
      CreateErrorMsgElem("ユーザ名を入力してください。");
    }
  } else {
    try {
      // userIdが元々の自分のuserIdの場合
      const responseMyIdCheck = await fetch("/api/user-info");
      const currentMyUserId = await responseMyIdCheck.json();

      // id重複チェック
      const responseIdCheck = await fetch("/api/user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userIdElem.value,
        }),
      });
      if (responseIdCheck.ok) {
        const userInfo = await responseIdCheck.json();
        if (
          userInfo.userId != "" &&
          userInfo.userId != currentMyUserId.userId
        ) {
          CreateErrorMsgElem("このユーザIDは既に使われています。");
        } else {
          // 問題なければ登録情報を送信してログイン画面に遷移
          // 登録情報送信
          const responseRegist = await fetch("/editUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userIdElem.value,
              user_name: usernameElem.value,
            }),
          });
          if (responseRegist.ok) {
            // 画面遷移
            window.location.href = "/user";
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
});

const CreateErrorMsgElem = (errorMsg) => {
  const errorMsgTextElem = document.createElement("p");
  errorMsgTextElem.classList.add("error-msg");
  errorMsgTextElem.textContent = errorMsg;
  errorMsgElem.appendChild(errorMsgTextElem);
  return errorMsgTextElem;
};

// ユーザー情報の読み込み
document.addEventListener("DOMContentLoaded", () => {
  const idTextElement = document.getElementById("userIdText");
  const nameTextElement = document.getElementById("userNameText");
  getUserInfo();

  async function getUserInfo() {
    const response = await fetch("/api/user-info");
    const userInfo = await response.json();
    console.log(userInfo);
    idTextElement.innerText = userInfo.userId;
    nameTextElement.innerText = userInfo.userName;
  }
});
