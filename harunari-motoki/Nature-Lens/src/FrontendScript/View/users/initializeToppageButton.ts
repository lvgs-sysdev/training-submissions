import { router } from "../../EntryPoint.ts";

export const initializeToppageButton = async () => {
  const toppage_button = document.querySelector(".toppage_button");
  if (!toppage_button) {
    return;
  } else {
    toppage_button.addEventListener("click", async () => {
      try {
        window.history.pushState({ page: "toppage" }, "", "/");
        router();
      } catch (error) {
        throw new Error("Page Refresh error");
      }
    });
  }
};
