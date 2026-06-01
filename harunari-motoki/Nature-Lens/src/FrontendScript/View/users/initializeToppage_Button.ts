import { router } from "../../EntryPoint.js";

export const initializeToppage_Button = async () => {
  const toppage_button = document.querySelector(".toppage_button");

  if (!toppage_button) {
    console.error("何かがおかしい");
    throw new Error("HTML Error");
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
