// 実施する際はGeolocationPositionError.をコメントアウトして数字を代入
// GeolocationAPIに接続していないのでErrorの方が使えない
// server.jsの階層で  以下のコードを実行
// npx vitest --root . tests/client/unit/Test.getAccessGeolocationAPI.test.ts

import { vi, describe, it, expect } from "vitest";
import { getAccessGeolocationAPI } from "../../../src/FrontendScript/APIservice/scan/getAccessGeolocationAPI.ts";

describe("getAccessGeolocationAPI", () => {
  it("GPS取得に成功したとき、正しいデータを返すこと", async () => {
    // 1. モックの作成（タイポを修正し、vi.stubGlobalでグローバルに登録）
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        success({
          coords: { latitude: 35.7, longitude: 139.8 },
        }),
      ),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeolocation });

    // 2. テストの実行（itのブロック内に含める）
    const result = await getAccessGeolocationAPI();

    // 3. 検証
    expect(result.status).toBe("success");
    if (result.status === "success" && result.data) {
      expect(result.data.latitude).toBe(35.7);
      expect(result.data.longitude).toBe(139.8);
    }
  });

  it("位置情報が利用できない時、failure と POSITION_UNAVAILABLE を返すこと", async () => {
    // タイムアウトエラー（code: 3）を投げる偽物
    const mockGeolocation = {
      getCurrentPosition: vi
        .fn()
        .mockImplementation((_success, error) => error({ code: 1 })),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeolocation });

    const result = await getAccessGeolocationAPI();

    expect(result.status).toBe("failure");
    // errorDetail が 1 (POSITION_UNAVAILABLE) であることを確認
    if (result.status === "failure") {
      expect(result.errorDetail).toBe(1);
    }
  });

  it("位置情報が利用できないとき、failure と PERMISSION_DENIED を返すこと", async () => {
    const mockGeolocation = {
      getCurrentPosition: vi
        .fn()
        .mockImplementation((_success, error) => error({ code: 2 })),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeolocation });

    const result = await getAccessGeolocationAPI();

    expect(result.status).toBe("failure");
    // errorDetail が 2 (PERMISSION_DENIED) であることを確認
    if (result.status === "failure") {
      expect(result.errorDetail).toBe(2);
    }
  });

  it("タイムアウトしたとき、failure と TIMEOUT を返すこと", async () => {
    // タイムアウトエラー（code: 3）を投げる偽物
    const mockGeolocation = {
      getCurrentPosition: vi
        .fn()
        .mockImplementation((_success, error) => error({ code: 3 })),
    };
    vi.stubGlobal("navigator", { geolocation: mockGeolocation });

    const result = await getAccessGeolocationAPI();

    expect(result.status).toBe("failure");
    // errorDetail が 3 (TIMEOUT) であることを確認
    if (result.status === "failure") {
      expect(result.errorDetail).toBe(3);
    }
  });
});
