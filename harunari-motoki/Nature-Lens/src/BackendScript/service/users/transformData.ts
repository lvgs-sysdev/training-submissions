import { userInfo } from "../../../library/users/typeDefinition.js";

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
