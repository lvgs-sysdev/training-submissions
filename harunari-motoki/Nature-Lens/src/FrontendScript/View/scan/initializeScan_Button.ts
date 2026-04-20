import { router } from "../../EntryPoint.ts";
import { ClientSideControl } from "../../Services/scan/ClientSideControl.ts";
import { postSilentRefresh } from "../../APIservice/users/postSilentRefresh.ts";

export const initializeScan_Button = () => {
  const scanButton = document.querySelector(".scan_button");

  if (!scanButton) {
    return;
  }

  scanButton.addEventListener("click", async () => {
    try {
      await postSilentRefresh(); //scan前にトークン情報を更新
      const response = await ClientSideControl();

      if (response.status === "success") {
        // 分離した表示関数を呼び出す
        const { count } = response.data;
        const { results } = response.data;
        history.pushState(
          { count, results, page: "scanResult" },
          "",
          "/scanResult",
        );
        console.log("スキャン結果表示前");
        router();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("通信エラーが発生しました。アプリを再起動してください。");
    }
  });
};
