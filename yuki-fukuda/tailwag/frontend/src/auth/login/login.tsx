/** @jsx React.createElement */
import React, { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";
import { initRegister } from "../register/index";
import { initTimeline } from "../../feed/timeline/timeline";

export const LoginForm = ({ containerId }: { containerId: string }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", color: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", color: "" });

    const results = [validateEmail(email), validatePassword(password)];
    const errorResult = results.find((r) => !r.isValid);

    if (errorResult) {
      setMessage({ text: errorResult.message, color: "orange" });
      return;
    }

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", String(data.user.id));
        setMessage({ text: "ログイン成功!", color: "green" });

        setTimeout(() => initTimeline("root"), 1000);
      } else {
        setMessage({
          text: "エラー：" + (data.message || "ログインに失敗しました"),
          color: "red",
        });
      }
    } catch (error) {
      console.error("通信エラー", error);
      setMessage({ text: "サーバーに接続できませんでした", color: "red" });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">ログイン</button>
        </form>
        <div style={{ color: message.color, marginTop: "10px" }}>
          {message.text}
        </div>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            initRegister(containerId);
          }}
        >
          新規登録はこちら
        </a>
      </div>
    </div>
  );
};
