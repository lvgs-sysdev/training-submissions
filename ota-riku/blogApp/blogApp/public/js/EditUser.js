// 入力チェックと変更処理
const editForm = document.getElementById("edit-user-form");
const errorMsgElem = document.getElementById("error-msg");

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // パスワード確認入力一致チェック
  //　入力欄と確認入力欄を取ってくる
  const userIdElem = document.getElementById("userIdText");
  const usernameElem = document.getElementById("userNameText");

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
    const usernameCheck = usernameElem.value.match(
      /^[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~。\u3000-\u303F\uFF01-\uFF0F\uFF1A-\uFF1F\uFF3B-\uFF3D\uFF5B-\uFF5D\uFF5E]*$/
    );
    const userIdCheck = !userIdElem.value.match(/^[a-zA-Z0-9]*$/);
    if (usernameCheck || userIdCheck) {
      if (userIdCheck) {
        CreateErrorMsgElem("ユーザーIDには英数字のみ含められます。");
      }
      if (usernameCheck) {
        CreateErrorMsgElem("ユーザー名には記号は含められません。");
      }
    } else {
      try {
        // userIdが元々の自分のuserIdの場合
        const responseMyIdCheck = await fetch("/api/user-info");
        if (responseMyIdCheck.ok) {
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
              } else {
                const error = new Error(
                  `HTTP Error is occored.${response.status} ${response.statusText}`
                );
                error.statusCode = response.status;
                error.statusText = response.statusText;
                throw error;
              }
            }
          } else {
            const error = new Error(
              `HTTP Error is occored.${response.status} ${response.statusText}`
            );
            error.statusCode = response.status;
            error.statusText = response.statusText;
            throw error;
          }
        } else {
          const error = new Error(
            `HTTP Error is occored.${response.status} ${response.statusText}`
          );
          error.statusCode = response.status;
          error.statusText = response.statusText;
          throw error;
        }
      } catch (e) {
        console.log(e);
        window.location.href = `/error/${e.statusCode}`;
      }
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
    try {
      const response = await fetch("/api/user-info");
      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo);
        idTextElement.innerText = userInfo.userId;
        nameTextElement.innerText = userInfo.userName;
      } else {
        const error = new Error(
          `HTTP Error is occored.${response.status} ${response.statusText}`
        );
        error.statusCode = response.status;
        error.statusText = response.statusText;
        throw error;
      }
    } catch (e) {
      console.log(e);
      window.location.href = `/error/${e.statusCode}`;
    }
  }
});
