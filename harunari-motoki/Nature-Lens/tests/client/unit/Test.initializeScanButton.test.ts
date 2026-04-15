import { describe, it, expect, vi, beforeEach } from "vitest";
import { initializeScanButton } from "../../../src/FrontendScript/View/initializeScanButton";
import { ClientSideControl } from "../../..//src/FrontendScript/APIservice/ClientSideControl.ts";
import { updateScanResultUI } from "../../..//src/FrontendScript/Viewmodel/updateScanResultUI.ts";

// 1. 外部依存（APIとUI更新関数）をモック化する
vi.mock("../../..//src/FrontendScript/APIservice/ClientSideControl.ts");
vi.mock("../../..//src/FrontendScript/Viewmodel/updateScanResultUI.ts");

describe("initializeScanButton のテスト", () => {
  beforeEach(() => {
    // 2. DOMの準備
    document.body.innerHTML = `
      <button class="scan_button">スキャン</button>
      <div class="scanresult-container"></div>
    `;
    // モックの呼び出し履歴をリセット
    vi.clearAllMocks();
  });

  it("ボタンクリック時にAPIが成功したら UI更新関数が呼ばれること", async () => {
    // 3. APIが成功を返すように設定
    const mockData = {
      status: "success",
      data: {
        offset: 0,
        limit: 1,
        endOfRecords: true,
        count: 1,
        results: [
          {
            key: 5386000947,
            kingdom: "Animalia",
            species: "Bulweria bulwerii",
            year: 2024,
            month: 7,
            day: 26,
            gbifID: "5386000947",
            occurrenceID: "URN:catalog:CLO:EBIRD:OBS2347732452",
          },
        ],
        facets: [],
      },
    } as const;
    vi.mocked(ClientSideControl).mockResolvedValue(mockData as any);

    // 4. 初期化してボタンをクリック
    initializeScanButton();
    const button = document.querySelector(".scan_button") as HTMLButtonElement;
    button.click();

    // 5. 非同期処理が終わるのを少し待つ（重要！）
    await vi.waitFor(() => {
      // ① まず「モックされた関数」を取得
      const mockedUpdateUI = vi.mocked(updateScanResultUI);

      // ② そもそも呼ばれたかどうかを確認（呼ばれていない間はここでもう一度待機してくれる）
      expect(mockedUpdateUI).toHaveBeenCalled();

      // ③ 呼ばれたことが確認できたら、引数を取り出す
      const lastCall = mockedUpdateUI.mock.calls[0];

      // ④ 各引数を個別に検証
      expect(lastCall[0]).toBe(mockData.data.count);
      expect(lastCall[1]).toEqual(mockData.data.results);
    });
  });

  it("APIが失敗したときに alert が表示されること", async () => {
    // window.alert をモック化
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    // APIがエラーを返す設定
    vi.mocked(ClientSideControl).mockResolvedValue({
      status: "failure",
      message: "サーバでエラーがありました 再度実行してください",
    });

    initializeScanButton();
    const button = document.querySelector(".scan_button") as HTMLButtonElement;
    button.click();

    await vi.waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "サーバでエラーがありました 再度実行してください",
      );
    });
  });
});
