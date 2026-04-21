import { GBIFdetailInfo } from "@/library/scan/typeDeffinition";
import DOMPurify from "dompurify";

export async function updateScanResult(
  count: number,
  results: GBIFdetailInfo[],
) {
  const container = document.querySelector(".app");
  if (!container) {
    throw new Error("");
  } else {
    const defienedCount: number = results.filter(
      (res) => res.scientificName,
    ).length;

    container.innerHTML = "";
    const htmlTemplate = `
    <button type="button" class="scan_button">
      Let's Scan!!
    </button>
    <button type="button" class="logout_button">ログアウト</button>
    <!--  <button type="button" class="scan_detail">スキャン詳細・再スキャン</button> -->
    <header>
      <p>スキャン結果：${count}個体</p>
      <p>※学名まで特定した${defienedCount}個体のみ表示</p>
    </header>
    ${results
      .filter((res) => res.scientificName)
      .map(
        (res) => `
      <div>
        <p >学名：${res.scientificName}</p>
        <p>界：${res.kingdom}</p>
        <p>門：${res.phylum}</p>
        <p>目：${res.order}</p>
        <p>科：${res.family}</p>
        <p>属：${res.genus}</p> 
        <p>科：${res.family}</p>
        <p>科：${res.family}</p>
        <p>科：${res.family}</p>
        <p>生息区分：${res.isWild}</p>
        <!-- <p>データ不備：${res.issues}</p> -->
        <p>写真：${
          res.media && res.media.length > 0
            ? `<img src="${res.media[0].identifier}"><br><small>© ${res.rightsHolder}</small>`
            : "No Image"
        }</p>
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
