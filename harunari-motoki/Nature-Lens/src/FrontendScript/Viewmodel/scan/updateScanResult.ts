import { GBIFdetailInfo } from "@/library/scan/typeDeffinition";
import DOMPurify from "dompurify";

export async function updateScanResult(
  count: number,
  results: GBIFdetailInfo[],
) {
  const container = document.querySelector(".scanresult-container");
  if (!container) {
    throw new Error("");
  } else {
    container.innerHTML = "";
    const htmlTemplate = `
    <button type="button" class="logout_button">ログアウト</button>
    <button type="button" class="scan_detail">スキャン詳細・再スキャン</button>
    <div>
      <p>スキャン結果：${count}</p>
    </div>
    ${results
      .map(
        (res) => `
      <div>
        <p>種名：${res.species}</p>
        <p>観察年月日：${res.year}/${res.month}/${res.day}</p>
        <br>
      </div>
    `,
      )
      .join("")}
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
  }
}
