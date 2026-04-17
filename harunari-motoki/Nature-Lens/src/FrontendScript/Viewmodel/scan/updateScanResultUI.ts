import { GBIFdetailInfo } from "@/library/scan/typeDeffinition";

export async function updateScanResultUI(
  count: number,
  results: GBIFdetailInfo[],
) {
  const Container = document.querySelector(".scanresult-container");
  if (!Container) {
    throw new Error("");
  } else {
    Container.innerHTML = "";

    const headDiv = document.createElement("div");
    const countP = document.createElement("p");
    countP.textContent = `スキャン結果：${count}`;
    const lineBreak = document.createElement("br");
    headDiv.appendChild(countP);
    headDiv.appendChild(lineBreak);

    Container.appendChild(headDiv);

    const fragment = document.createDocumentFragment();

    results.forEach((res) => {
      const wrapper = document.createElement("div");
      const speciesP = document.createElement("p");
      speciesP.textContent = `種名：${res.species}`;
      const dateP = document.createElement("p");
      dateP.textContent = `観察年月日：${res.year}/${res.month}/${res.day}`;
      const lineBreak = document.createElement("br");

      wrapper.appendChild(speciesP);
      wrapper.appendChild(dateP);
      wrapper.appendChild(lineBreak);

      fragment.appendChild(wrapper);
    });

    Container.appendChild(fragment);
    console.log(Container);
  }
}
