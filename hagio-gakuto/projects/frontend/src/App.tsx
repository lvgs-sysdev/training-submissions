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

function App() {
  return (
    <>
      <LoadingProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/login/signup" element={<SignUp />} />

                <Route index element={<Home />} />
                <Route path="/mypage" element={<MypPage />} />

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
