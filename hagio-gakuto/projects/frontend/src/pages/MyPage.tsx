import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../hooks/useLogout";

const MypPage: React.FC = () => {
  const { executeLogout, validationError, nonFieldError } = useLogout();
  const logout = async () => await executeLogout();

  return (
    <>
      <h1>MyPage</h1>
      <button type="button" onClick={logout} className=" cursor hover">
        <LogoutIcon />
      </button>
    </>
  );
};
export default MypPage;
