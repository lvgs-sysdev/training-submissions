import { userInfo } from "../../../library/users/typeDefinition.js";

export const correctLoginFormData = async () => {
  const loginFormInputs =
    document.querySelectorAll<HTMLInputElement>(".loginForm input");
  const formData = new FormData();

  loginFormInputs.forEach((input) => {
    if (input.name) {
      formData.append(input.name, input.value);
    }
  });

  const data: userInfo = {
    user_ID: formData.get("user_ID")! as string,
    password: formData.get("password")! as string,
  };

  console.log("correctLoginFormData 送るデータの中身", data);
  return data;
};
