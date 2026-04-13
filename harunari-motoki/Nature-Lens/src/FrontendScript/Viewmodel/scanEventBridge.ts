import { GBIFdetailInfo } from "@/sharedObject/typeDeffinition";
import { ClientSideControl } from "../APIservice/ClientSideControl";

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

        const scanResultContainer = document.querySelector(
          ".scanresult-container",
        );
        if (scanResultContainer) {
          scanResultContainer.innerHTML = `<p>スキャン結果：${count}</p><br>`;
          //今後長くなれば関数として切り取る
          results.forEach((results: GBIFdetailInfo) => {
            scanResultContainer.innerHTML += `
              <p>種名：${results.species}</p><br>
              <p>観察年月日：${results.year}/${results.month}/${results.day}</p><br>`;
          });
        }
      } else {
        const { message } = response;
        alert(message);
      }
    } catch (error) {
      const message = "エラーが発生しました。アプリを再起動してください。";
      alert(message);
    }
  });
}
