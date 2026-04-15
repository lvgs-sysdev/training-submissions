// import { vi, describe, it, expect } from "vitest";
import { updateScanResultUI } from "../../../src/FrontendScript/Viewmodel/updateScanResultUI";
import { GBIFdetailInfo } from "../../../src/sharedObject/typeDeffinition.ts";
import { describe, it, expect, beforeEach } from "vitest";

describe("updateScanResultUI のテスト", () => {
  // 各テストの前に DOM をリセットする
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="scanresult-container"></div>
    `;
  });

  it("正しくスキャン結果とリストが反映されること", async () => {
    // 1. テストデータの準備
    const mockCount = 1;
    const mockResults: GBIFdetailInfo[] = [
      {
        key: 3346174605,
        kingdom: "Plantae",
        species: "Isotrema kaempferi",
        year: 2003,
        month: 7,
        day: 20,
        gbifID: "3346174605",
        occurrenceID: "AB353650",
      },
    ];

    // 2. 関数の実行
    await updateScanResultUI(mockCount, mockResults);

    // 3. 検証（アサーション）
    const container = document.querySelector(".scanresult-container");

    // スキャン結果の件数が表示されているか
    expect(container?.textContent).toContain("スキャン結果：1");

    // リストの内容が含まれているか
    expect(container?.textContent).toContain("種名：Isotrema kaempferi");
    expect(container?.textContent).toContain("観察年月日：2003/7/20");

    // 要素の数が正しいか（例：pタグが合計何個あるかなど）
    const pElements = container?.querySelectorAll("p");
    expect(pElements?.length).toBe(3); // ヘッダー(1) + 各データ(2個×2セット) = 5
  });

  it("コンテナが存在しない場合にエラーを投げること", async () => {
    // HTMLを空にしてコンテナを消す
    document.body.innerHTML = "";

    // エラーがスローされることを検証
    await expect(updateScanResultUI(0, [])).rejects.toThrow();
  });
});
