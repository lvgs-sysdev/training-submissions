import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>ご登録ありがとうございます！</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>ようこそ、{name}さん！</Heading>
        <Text style={text}>
          この度は、当社の家探しアプリにご登録いただき、誠にありがとうございます。
        </Text>
        <Text style={text}>
          このアプリが、あなたの理想の住まいを見つけるための最高のパートナーになることを願っています。早速、物件の検索を始めましょう！
        </Text>
        <Button
          style={button}
          href="http://52.69.254.133/" // ★ 将来的には本番のURLに変更
          //   pX={20}
          //   pY={12}
        >
          物件を探す
        </Button>
        <Text style={text}>
          ご不明な点がございましたら、お気軽にお問い合わせください。
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// --- スタイル定義 ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
};

const h1 = {
  color: "#1d3557",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const text = {
  color: "#457b9d",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 20px",
};

const button = {
  backgroundColor: "#0077b6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  margin: "20px auto",
};
