import { GBIFdetailInfo } from "@/sharedObject/typeDiffinition.ts";
import { ClientSideControl } from "../APIservice/GeolocationTrafficcontrol.ts";

const scanButton = document.querySelector(".scan_button");

if (!scanButton) {
  // 【オプション】サーバサイドにログを送りたい
  alert("処理が正常に終了しませんでした。再度実行してください。");
} else {
  scanButton.addEventListener("click", async (_) => {
    const response = await ClientSideControl();
    try {
      if (response.status === "success") {
        const { count } = response.data;
        const { results } = response.data;
        //HTMLにデータ注入処理
        // 要修正--------------------------------------------
        const updateView = (count: number, results: GBIFdetailInfo[]) => {
          const scanResultContainer = document.querySelector(
            ".scanresult-container",
          );

          if (scanResultContainer) {
            scanResultContainer.innerHTML = `
             <p>スキャン結果：${count}</p><br>`;
            results.forEach((results: GBIFdetailInfo) => {
              `<p>種名：${results.species}</p><br>
             <p>観察年月日：${results.year}/${results.month}/${results.day}</p><br>`;
            });
          }
        };
        // 要修正--------------------------------------------
      } else {
        const { message } = response;
        alert(message);
      }
    } catch (error) {
      const message = "エラーが発生しました。再度実行してください。";
      alert(message);
    }
  });
}
