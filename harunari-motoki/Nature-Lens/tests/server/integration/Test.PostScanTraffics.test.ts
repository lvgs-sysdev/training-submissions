// １。インターネット接続環境
// server.jsの階層で  以下のコードを実行
// npx vitest --root . tests/server/integration/Test.PostScanTraffics.test.ts

// １。インターネット未接続環境
// server.jsの階層で  コード内ののコメントアウトを外して実行　コメントアウトを外した箇所だけ成功するはず
// npx vitest --root . tests/server/integration/Test.PostScanTraffics.test.ts

import Fastify from "fastify";
import { postScanTraffics } from "../../../src/BackendScript/controllers/scan/postScanTraffics.ts";
import { coordinateSchema } from "../../../src/BackendScript/Interface/schema.ts";
import { describe, expect, test, beforeAll } from "vitest";

describe("postScanpTraffics のテスト 正常系（インターネット接続あり）", () => {
  const fastify = Fastify();

  // テストの前に一度だけルートを登録し、準備を完了させる
  beforeAll(async () => {
    fastify.post("/scanResult", { schema: coordinateSchema }, postScanTraffics);
    await fastify.ready(); // ★これを追加すると安定します
  });

  test("該当データがある場合 200 OK が返ること", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/scanResult",
      payload: {
        latitude: 35, // スキーマの範囲（-90~90）内か確認
        longitude: 139,
      },
    });
    const body = response.json(); //axiosのJSONへの自動変換機能を再現
    console.log("Response Body:", body);
    const data = body.data;
    console.log(data);

    // ステータスコードの確認
    expect(response.statusCode).toBe(200);
    // レスポンスの中身の構造を確認
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
  });

  test("該当データがない場合 200 OK が返ること", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/scanResult",
      payload: {
        latitude: -50, // スキーマの範囲（-90~90）内か確認
        longitude: -122,
      },
    });
    const body = response.json();
    console.log("Response Body:", body);

    // ステータスコードの確認
    expect(response.statusCode).toBe(200);
    // レスポンスの中身の構造を確認
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
  });

  // test("インターネットに接続していない場合 500 Erroe が返ること", async () => {
  //   const response = await fastify.inject({
  //     method: "POST",
  //     url: "/scanResult",
  //     payload: {
  //       latitude: -50, // スキーマの範囲（-90~90）内か確認
  //       longitude: -122,
  //     },
  //   });
  //   expect(response.statusCode).toBe(500);

  //   const body = response.json();
  //   console.log("Validation Error Details:", body);

  //   // レスポンスの中身の構造を確認
  //   expect(body.error).toBe("サーバでエラーがありました 再度実行してください");
  // });

  test("送信データが不正なときは 400 Error が返ること", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/scanResult",
      payload: {
        latitude: -122, // スキーマの範囲（-90~90）内か確認
        longitude: -50,
      },
    });
    // ステータスコードの確認
    expect(response.statusCode).toBe(400);

    const body = response.json();
    console.log("Validation Error Details:", body);

    // レスポンスの中身の構造を確認
    expect(body.error).toBe("Bad Request");
  });
});
