import React, { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../components/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

const MypPage: React.FC = () => {
  const { executeLogout, validationError, nonFieldError } = useLogout();
  const logout = async () => await executeLogout();
  const { user } = useAuth();
  const navigate = useNavigate();
  useTitle("マイページ");
  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <h1>MyPage</h1>
      <button type="button" onClick={logout} className=" cursor hover">
        <LogoutIcon />
      </button>
      <Link
        to="/mypage/changepassword"
        aria-label="Change Password"
        title="Change Password"
        className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
      >
        パスワード変更
      </Link>
    </>
  );
};
export default MypPage;
