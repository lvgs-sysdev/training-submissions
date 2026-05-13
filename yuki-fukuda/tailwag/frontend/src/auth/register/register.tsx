// @ts-nocheck
/** @jsx h */
import { h } from "../../dom.ts";
//
import { initLogin } from "../login/index";

export const RegisterForm = (containerId: string) => {
  return (
    <div class="auth-card">
      <h1>新規登録</h1>
      <form id="register-form">
        <div>
          <label>ユーザーID</label>
          <input type="text" name="account_id" id="account_id" required />
        </div>
        <div>
          <label>ユーザー名</label>
          <input type="text" name="account_name" id="account_name" required />
        </div>
        <div>
          <label>メールアドレス</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label>パスワード</label>
          <input type="password" name="password" id="password" required />
        </div>
        <button type="submit">登録する</button>
      </form>

      <div id="message"></div>

      <a
        href="#"
        onclick={(e: Event) => {
          e.preventDefault();
          initLogin(containerId);
        }}
      >
        ログインはこちら
      </a>
    </div>
  );
};
