import { ClientSideControl } from "../APIservice/ClientSideControl.ts";
import { updateScanResultUI } from "../Viewmodel/updateScanResultUI.ts";

export const initializeScanButton = () => {
  const scanButton = document.querySelector(".scan_button");

  if (!scanButton) {
    return;
  }

  scanButton.addEventListener("click", async () => {
    try {
      const response = await ClientSideControl();

      if (response.status === "success") {
        // 分離した表示関数を呼び出す
        const { count } = response.data;
        const { results } = response.data;

        await updateScanResultUI(count, results);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("通信エラーが発生しました。アプリを再起動してください。");
    }
  });
};
