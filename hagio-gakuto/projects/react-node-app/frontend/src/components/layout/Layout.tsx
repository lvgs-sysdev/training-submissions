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
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default Layout;
