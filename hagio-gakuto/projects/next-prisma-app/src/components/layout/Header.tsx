"use client";

import { useAuth } from "@/context/AuthContext";
import Nav from "./components/Nav";

export default function Header() {
  const { user } = useAuth(); // Contextからuserとlogoutを取得
  const navLinks = [
    { href: "/", name: "Home" },
    { href: "/", name: "Our product" },
    { href: "/", name: "Features" },
    { href: "/", name: "Product pricing" },
    { href: "/", name: "Pricing" },
    { href: "/about", name: "About us" },
  ];
  console.log("Current user:", user); // デバッグ用に現在のユーザーを表示
  return (
    <header>
      <div className="mx-auto max-w-screen-xl py-4 md:py-4 px-4">
        <div className="relative flex items-center justify-between">
          <a
            href="/"
            aria-label="Company"
            title="Company"
            className="inline-flex items-center"
          >
            <svg
              className="w-8 text-deep-purple-accent-400"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              stroke="currentColor"
              fill="none"
            >
              <rect x="3" y="1" width="7" height="12" />
              <rect x="3" y="17" width="7" height="6" />
              <rect x="14" y="1" width="7" height="6" />
              <rect x="14" y="11" width="7" height="12" />
            </svg>
            <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">
              Company
            </span>
          </a>
          <ul className="flex items-center hidden space-x-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Nav href={link.href} name={link.name} />
              </li>
            ))}
            <li>
              {user ? (
                <Nav href="/mypage" name="My Page" />
              ) : (
                <Nav href="/login" name="Login" />
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
