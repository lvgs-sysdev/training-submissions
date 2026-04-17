export type userInfo = {
  user_ID: string;
  user_name?: string;
  password: string;
};

type accessSuccess = {
  status: "success";
};
type accessFailure = {
  status: "failure";
};

export type accessStatus = accessSuccess | accessFailure;
