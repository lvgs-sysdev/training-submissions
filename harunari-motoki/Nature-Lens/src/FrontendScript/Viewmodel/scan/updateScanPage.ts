import DOMPurify from "dompurify";

export const updateScanPage = async () => {
  const container = document.querySelector(".app");
  console.log("updateScanPage.tsどこで動いた？");
  if (!container) {
    console.error("HTMLエラー");
    throw new Error("");
  } else {
    //画面初期化
    container.innerHTML = ``;
    const htmlTemplate = `
    <button type="button" class="scan_button">
      Let's Scan!!
    </button>
    
    <div class="scanresult-container"></div>

    <button type="button" class="logout_button">
      ログアウト
    </button> 
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
  }
};
