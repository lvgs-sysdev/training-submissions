"use client";

import Link from "next/link";
import MainNav from "./MainNav";
import { useAuth } from "@/context/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { userState } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <header className="p-4 border-b shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-lg md:text-xl">
            <Link href="/">ONLINE LEARNING</Link>
          </h1>
          <MainNav />
        </div>
      </header>
      {pathname === "/" && (
        <section className="bg-gray-100 p-4">
          <div className="container mx-auto">
            <p className="text-muted-foreground md:text-xl lg:text-2xl pt-2 pb-2">
              {!!userState
                ? `${userState.userName}さん、おかえりなさい！`
                : "ようこそ！"}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
