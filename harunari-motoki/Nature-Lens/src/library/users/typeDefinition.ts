export type userInfo = {
  user_ID: string;
  user_name?: string;
  password: string;
};

type accessSuccess = {
  status: "success";
  token?: any;
};
type accessFailure = {
  status: "failure";
  message?: string;
};

export type accessStatus = accessSuccess | accessFailure;
