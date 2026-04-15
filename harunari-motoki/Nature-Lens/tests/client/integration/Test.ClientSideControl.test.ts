import { vi, describe, it, expect, beforeEach } from "vitest";
import { ClientSideControl } from "../../../src/FrontendScript/APIservice/ClientSideControl.ts";
import { getAccessGeolocationAPI } from "../../../src/FrontendScript/APIservice/getAccessGeolocationAPI.ts";
import { postAxiosserver } from "../../../src/FrontendScript/APIservice/postAxiosserver.ts";

// 1. 依存している外部関数をモック化（スタントマンにする）
vi.mock("../../../src/FrontendScript/APIservice/getAccessGeolocationAPI.ts");
vi.mock("../../../src/FrontendScript/APIservice/postAxiosserver.ts");

describe("ClientSideControl", () => {
  // 各テストの前にモックの状態をリセット
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("【正常系】GPS取得とサーバー送信の両方に成功した場合、successを返すこと", async () => {
    // GPSが成功したと仮定
    vi.mocked(getAccessGeolocationAPI).mockResolvedValue({
      status: "success",
      data: { latitude: 40, longitude: 140 },
    });

    // サーバーが「該当あり」と答えたと仮定
    const mockServerData = {
      status: "Applicable",
      data: { count: 1, results: [{ key: 123 }] },
      message: "該当データあり",
    };
    vi.mocked(postAxiosserver).mockResolvedValue(mockServerData as any);

    const result = await ClientSideControl();

    // 最終的な戻り値のチェック
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.data).toEqual(mockServerData.data);
    }
  });

  it("【準正常系】サーバーにデータがなかった場合(NotApplicable)、failureとメッセージを返すこと", async () => {
    vi.mocked(getAccessGeolocationAPI).mockResolvedValue({
      status: "success",
      data: { latitude: 40, longitude: 140 },
    });

    // サーバーが「該当なし」と答えたと仮定
    vi.mocked(postAxiosserver).mockResolvedValue({
      status: "NotApplicable",
      message: "該当データなし",
    } as any);

    const result = await ClientSideControl();

    expect(result.status).toBe("failure");
    if (result.status === "failure") {
      expect(result.message).toBe("該当データなし");
    }
  });

  it("【異常系】GPSが拒否された(errorDetail: 1)場合、適切な日本語メッセージを返すこと", async () => {
    // GPSが「許可されていません」と答えたと仮定
    vi.mocked(getAccessGeolocationAPI).mockResolvedValue({
      status: "failure",
      errorDetail: 1,
    });

    const result = await ClientSideControl();

    expect(result.status).toBe("failure");
    if (result.status === "failure") {
      expect(result.message).toBe(
        "位置情報の利用が許可されていません。設定を許可してください",
      );
      // この場合、サーバー通信(postAxiosserver)が呼ばれていないことも確認できる
      expect(postAxiosserver).not.toHaveBeenCalled();
    }
  });

  it("【異常系】GPSがタイムアウトした(errorDetail: 3)場合、適切な日本語メッセージを返すこと", async () => {
    vi.mocked(getAccessGeolocationAPI).mockResolvedValue({
      status: "failure",
      errorDetail: 3,
    });

    const result = await ClientSideControl();

    expect(result.status).toBe("failure");
    if (result.status === "failure") {
      expect(result.message).toBe(
        "タイムアウトです。電波のよう場所で再度実行してください",
      );
    }
  });

  it("【異常系】予期せぬエラー（例外）が発生した場合、catchブロックでエラー情報を返すこと", async () => {
    vi.mocked(getAccessGeolocationAPI).mockResolvedValue({
      status: "success",
      data: { latitude: 40, longitude: 140 },
    });

    // 通信中にプログラムがクラッシュしたと仮定
    const errorMessage = "Network Crash";
    vi.mocked(postAxiosserver).mockRejectedValue(new Error(errorMessage));

    const result = await ClientSideControl();

    expect(result.status).toBe("failure");
    // messageの中に Error: Network Crash が含まれているか
    if (result.status === "failure") {
      expect(result.message).toContain("予期せぬエラーが発生しました");
      expect(result.message).toContain(errorMessage);
    }
  });
});
