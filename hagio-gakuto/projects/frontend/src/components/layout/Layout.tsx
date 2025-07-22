import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useLoading } from "../context/LoadingContext";
import { Loading } from "./Loading";
import { useEffect } from "react";

const Layout = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    // ローディング中は背面のスクロールを禁止する
    if (isLoading) {
      document.body.style.overflow = "hidden";
    }
    // クリーンアップ関数：コンポーネントが消える時やisLoadingがfalseになった時に元のスタイルに戻す
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      <Loading />
      <Header />
      <main className="mx-auto max-w-screen-xl my-8 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default Layout;
