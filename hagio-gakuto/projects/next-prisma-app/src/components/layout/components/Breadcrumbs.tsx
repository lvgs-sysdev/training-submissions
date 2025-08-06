"use client"; // フックを使うためクライアントコンポーネントにする

import Link from "next/link"; // ★ next/linkからインポート
import { usePathname } from "next/navigation"; // ★ next/navigationからインポート

const HomeIcon = () => (
  <svg
    className="w-3 h-3 me-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
  </svg>
);

const SeparatorIcon = () => (
  <svg
    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 9 4-4-4-4"
    />
  </svg>
);

const Breadcrumbs = () => {
  const pathname = usePathname(); // ★ useLocationからusePathnameに変更
  const pathnames = pathname.split("/").filter((x) => x);

  // ★ URLのパス名(kebab-case)に合わせる
  const breadcrumbNameMap: { [key: string]: string } = {
    login: "Login",
    signup: "Sign Up",
    mypage: "My Page",
    about: "About us",
    "change-password": "Change Password",
    "edit-profile": "Edit Profile",
    "delete-account": "Delete Account",
    "product-pricing": "Product Pricing",
  };

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <HomeIcon />
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const name = breadcrumbNameMap[value] || value;

          return (
            <li key={to} {...(isLast ? { "aria-current": "page" } : {})}>
              <div className="flex items-center">
                <SeparatorIcon />
                {isLast ? (
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    {decodeURIComponent(name)}
                  </span>
                ) : (
                  <Link
                    href={to} // ★ to={to} から href={to} に変更
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    {decodeURIComponent(name)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
