import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Error from "./pages/ErrorPage";
import Home from "./pages/HomePage";
import "./App.css";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import { LoadingProvider } from "./components/context/LoadingContext";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="about" element={<AboutPage />} /> */}
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}
export default App;
