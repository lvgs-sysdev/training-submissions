'use strict';

// 引数のURIにHTTPリクエストをして受け取ったレスポンスをJSON形式でreturnする
export const fetchData = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) throw new Error();

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// 引数で受け取った日付を01 Jan 2025のような形式にフォーマットする
export const formatDate = (date) => {
  const dateObj = new Date(date);
  const options = {
      timeZone: "Asia/Tokyo",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    
  const jstDate = new Intl.DateTimeFormat("en-GB", options).format(dateObj);

  return jstDate;
}