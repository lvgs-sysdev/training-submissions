import { updateTopPage } from "../../Viewmodel/users/updateTopPage.ts";

export const viewIndex = async () => {
  const viewTopPage = document.querySelector(".app");

  if (!viewTopPage) {
    return;
  } else {
    try {
      window.history.pushState({}, "", "/");
      await updateTopPage();
    } catch (error) {
      throw new Error("Page Refresh error");
    }
  }
};
