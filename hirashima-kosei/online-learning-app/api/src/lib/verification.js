import { Resend } from "resend";

// 送信結果を返し、例外は投げない（呼び出し側で処理継続可）
export default async function sendVerificationMail(email, verificationToken) {
  // 1つ目のoriginのみ使う
  const baseOrigin = process.env.NEXT_ORIGIN.split(",")[0].trim();
  const confirmLink = `${baseOrigin}/verified?verifiedToken=${verificationToken}`;

  const logLink = () => {
    console.log(`Verification link for ${email}: ${confirmLink}`);
  };

  // RESEND_API_KEY 未設定ならリンク出力のみ
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email send.");
    logLink();
    return { ok: false, reason: "NO_API_KEY", link: confirmLink };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "認証メール",
      html: `<p>以下のリンクをクリックして、メールアドレスの確認を行ってください。<br><a href="${confirmLink}">ここをクリック</a></p>`,
    });

    if (error) {
      console.error("Email send error:", error);
      logLink();
      return { ok: false, reason: "SEND_ERROR", error, link: confirmLink };
    }

    return { ok: true, data, link: confirmLink };
  } catch (err) {
    console.error("Email send exception:", err);
    logLink();
    return { ok: false, reason: "EXCEPTION", error: err, link: confirmLink };
  }
}
