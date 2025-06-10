document.addEventListener("DOMContentLoaded", () => {
  const targetElem = document.getElementById("new_article");
  targetElem.innerHTML = "";
  setNewArticle();

  async function setNewArticle() {
    try {
      const response = await fetch("/api/load-new-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleNum: 6 }),
      });
      if (response.ok) {
        targetElem.innerHTML = await response.text();
      } else {
        const error = new Error(
          `HTTP Error is occored.${response.status} ${response.statusText}`
        );
        error.statusCode = response.status;
        error.statusText = response.statusText;
        throw error;
      }
    } catch (e) {
      window.location.href = `/error/${e.statusCode}`;
    }
  }
});

const getDateText = (dateStr) => {
  const dateObj = new Date(dateStr);
  console.log(dateStr);

  const monthStr = dateObj.toLocaleString("en-US", { month: "short" });
  return `${dateObj.getDate()} ${monthStr} ${dateObj.getFullYear()}`;
};
