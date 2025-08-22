import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Error from "./pages/ErrorPage";
import Home from "./pages/HomePage";
import "./App.css";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import { LoadingProvider } from "./components/context/LoadingContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./components/context/AuthContext";
import MypPage from "./pages/MyPage";
import AboutUs from "./pages/AboutUsPage";
import ChangePassword from "./pages/ChangePasswordPage";

function App() {
  return (
    <>
      <LoadingProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/login/signup" element={<SignUp />} />

                <Route path="/mypage" element={<MypPage />} />
                <Route
                  path="/mypage/changepassword"
                  element={<ChangePassword />}
                />

                <Route path="/about" element={<AboutUs />} />

                {/* <Route path="about" element={<AboutPage />} /> */}
                <Route path="*" element={<Error />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LoadingProvider>
      <ToastContainer />
    </>
  );
}
export default App;
