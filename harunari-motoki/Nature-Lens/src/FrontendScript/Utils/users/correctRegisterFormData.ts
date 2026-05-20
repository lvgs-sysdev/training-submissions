import { userInfo } from "../../../library/users/typeDefinition.js";

export const correctRegisterFormData = async () => {
  const registerFormInputs = document.querySelectorAll<HTMLInputElement>(
    ".registerForm input",
  );
  const formData = new FormData();

  registerFormInputs.forEach((input) => {
    if (input.name) {
      formData.append(input.name, input.value);
    }
  });

  const data: userInfo = {
    user_ID: formData.get("user_ID")! as string,
    user_name: formData.get("user_name")! as string,
    password: formData.get("password")! as string,
  };

  console.log("送るデータの中身", data);
  return data;
};
