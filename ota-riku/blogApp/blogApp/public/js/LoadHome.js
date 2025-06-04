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
    const raws = await response.json();

    if (raws.length > 0) {
      for (var i = 0; i < raws.length; i++) {
        const articleElem = document.createElement("li");
        articleElem.classList.add("maincontents-card-elem");

        const imgLink = document.createElement("a");
        imgLink.href = `/detail/${raws[i].article_id}`;

        const articleImg = document.createElement("img");
        articleImg.src = "Image/card/card1.png";
        articleImg.alt = "card1";
        articleImg.classList = "maincontents-card-img";

        imgLink.appendChild(articleImg);

        articleElem.appendChild(imgLink);

        const categoryDateDiv = document.createElement("div");
        categoryDateDiv.classList.add("maincontents-card-categorydate-ul");

        const categoryTextElem = document.createElement("p");
        categoryTextElem.classList.add(
          "maincontents-card-catogorydate-categorytext"
        );
        categoryTextElem.textContent = "Travel";

        const borderElem = document.createElement("p");
        borderElem.classList.add("util-margin-0");
        borderElem.textContent = "|";

        const dateTextElem = document.createElement("p");
        dateTextElem.classList.add("maincontents-card-catogorydate-datetext");
        dateTextElem.textContent = getDateText(raws[i].updated_at);

        categoryDateDiv.appendChild(categoryTextElem);
        categoryDateDiv.appendChild(borderElem);
        categoryDateDiv.appendChild(dateTextElem);

        articleElem.appendChild(categoryDateDiv);

        const textGroupElem = document.createElement("dl");
        const articleTitleElem = document.createElement("dt");
        const titleLinkElem = document.createElement("a");
        titleLinkElem.href = "/detail";
        titleLinkElem.classList.add("maincontents-card-title-text");
        titleLinkElem.classList.add("util-margin-0");
        titleLinkElem.textContent = raws[i].article_title;

        articleTitleElem.appendChild(titleLinkElem);

        const articleContextElem = document.createElement("dd");
        articleContextElem.classList.add("maincontents-card-context-dd");

        const articleContextLinkElem = document.createElement("a");
        articleContextLinkElem.href = "/detail";
        articleContextLinkElem.classList.add("maincontents-card-context");
        articleContextLinkElem.classList.add("util-margin-0");
        articleContextLinkElem.textContent = raws[i].content.slice(0, 20);

        articleContextElem.appendChild(articleContextLinkElem);

        textGroupElem.appendChild(articleTitleElem);
        textGroupElem.appendChild(articleContextElem);

        articleElem.appendChild(textGroupElem);

        targetElem.appendChild(articleElem);
      }
    }
  }
});

const getDateText = (dateStr) => {
  const dateObj = new Date(dateStr);
  console.log(dateStr);

  const monthStr = dateObj.toLocaleString("en-US", { month: "short" });
  return `${dateObj.getDate()} ${monthStr} ${dateObj.getFullYear()}`;
};
