import { userInfo } from "../../../library/users/typeDefinition.ts";

export const transformData = async (data: userInfo) => {
  const arrayData = [];
  arrayData.push(data.user_ID);
  if (data.user_name) {
    arrayData.push(data.user_name);
  }
  arrayData.push(data.password);
  console.log(arrayData);
  return arrayData;
};

// //テスト
// const data: userInfo = {
//   user_ID: "q",
//   user_name: "q",
//   password: "q",
// };

// transformData(data);

// const dataa: userInfo = {
//   user_ID: "o",
//   password: "q",
// };

// transformData(dataa);
