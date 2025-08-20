import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "アカウントを有効化してください",
      html: `<p>あなたの確認コードは: <strong>${token}</strong>です。10分間有効です。</p>`,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("メールの送信に失敗しました。");
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const emailHtml = WelcomeEmail({ name });

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "ご登録ありがとうございます！",
      react: emailHtml,
    });
  } catch (error) {
    console.error("Welcome email sending failed:", error);
    throw new Error("ウェルカムメールの送信に失敗しました。");
  }
}
