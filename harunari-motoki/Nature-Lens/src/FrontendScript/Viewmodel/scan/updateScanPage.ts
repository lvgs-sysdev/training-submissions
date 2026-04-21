import DOMPurify from "dompurify";

export const updateScanPage = async () => {
  const container = document.querySelector(".app");
  if (!container) {
    console.error("HTMLエラー");
    throw new Error("");
  } else {
    container.innerHTML = ``;
    const htmlTemplate = `
    <button type="button" class="scan_button">
      Let's Scan!!
    </button>

    <button type="button" class="logout_button">
      ログアウト
    </button> 
    `;
    const cleanHTML = DOMPurify.sanitize(htmlTemplate);
    container.innerHTML = cleanHTML;
  }
};
