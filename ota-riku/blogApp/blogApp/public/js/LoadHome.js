document.addEventListener("DOMContentLoaded", () => {
  const targetElem = document.getElementById("new_article");
  targetElem.innerHTML = "";
  setNewArticle();

  async function setNewArticle() {
    const response = await fetch("/api/load-new-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleNum: 6 }),
    });

    targetElem.innerHTML = await response.text();
  }
});

const getDateText = (dateStr) => {
  const dateObj = new Date(dateStr);
  console.log(dateStr);

  const monthStr = dateObj.toLocaleString("en-US", { month: "short" });
  return `${dateObj.getDate()} ${monthStr} ${dateObj.getFullYear()}`;
};
