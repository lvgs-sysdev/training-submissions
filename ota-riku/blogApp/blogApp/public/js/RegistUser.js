const registForm = document.getElementById("register-form");
const errorMsgElem = document.getElementById("error-msg");

registForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // パスワード確認入力一致チェック
  //　入力欄と確認入力欄を取ってくる
  const userIdElem = document.getElementById("user_id");
  const passwordElem = document.getElementById("password");
  const passwordConfirmElem = document.getElementById("password_confirm");

  errorMsgElem.innerHTML = "";

  // 入力が空の場合
  if (
    userIdElem.value == "" ||
    passwordElem.value == "" ||
    passwordConfirmElem.value == ""
  ) {
    if (userIdElem.value == "") {
      CreateErrorMsgElem("ユーザIDを入力してください。");
    }
    if (passwordElem.value == "") {
      CreateErrorMsgElem("パスワードを入力してください。");
    }
    if (passwordConfirmElem.value == "") {
      CreateErrorMsgElem("確認用パスワードを入力してください。");
    }
  } else {
    const usernameCheck = userIdElem.value.match(/^[a-zA-Z0-9]*$/);
    const passwordCheck = passwordElem.value.match(/^[a-zA-Z0-9]*$/);
    if (!usernameCheck || !passwordCheck) {
      if (!usernameCheck) {
        CreateErrorMsgElem("ユーザIDは半角英数字のみで入力してください。");
      }
      if (!passwordCheck) {
        CreateErrorMsgElem("パスワードは半角英数字のみで入力してください。");
      }
    } else {
      // パスワードと確認用パスワードの入力チェック
      if (passwordElem.value != passwordConfirmElem.value) {
        CreateErrorMsgElem("パスワードと確認用パスワードが一致していません。");
      } else {
        try {
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
            if (userInfo.userId != "") {
              CreateErrorMsgElem("このユーザIDは既に使われています。");
            } else {
              // 問題なければ登録情報を送信してログイン画面に遷移
              // 登録情報送信
              const responseRegist = await fetch("/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_id: userIdElem.value,
                  password: passwordElem.value,
                }),
              });
              if (responseRegist.ok) {
                // 画面遷移
                window.location.href = "/login";
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
        } catch (e) {
          console.log(e);
          window.location.href = `/error/${e.statusCode}`;
        }
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
