document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  const errorState = path[path.length - 1];

  const errorMsgElem = document.getElementById("network-error-msg");
  const errorGuideElem = document.getElementById("network-error-guide-msg");

  let errorGuideText = "";

  if (400 < errorState < 499) {
    errorMsgElem.textContent = "クライアントエラーが発生しました";
    errorGuideText =
      "左上のタイトルロゴからトップページに戻って再度お試しください。";
  } else if (500 < errorState < 599) {
    errorMsgElem.textContent = "サーバーエラーが発生しました";
    errorGuideText =
      "申し訳ございません。サーバー側でエラーが発生しております。<br>しばらく経ってからお試しください。";
  } else {
    errorMsgElem.textContent = "予期せぬエラーが発生しました";
    errorGuideText = "申し訳ございません。予期せぬエラーが発生しました。";
  }

  errorGuideElem.textContent = errorGuideText;
});
