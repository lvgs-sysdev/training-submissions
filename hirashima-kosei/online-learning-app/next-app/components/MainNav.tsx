"use client";

import Link from "next/link";
import { homeConfig } from "@/config/home";
import MobileNav from "./MobileNav";
import { useAuth } from "@/context/auth";
import UserIcon from "./UserIcon";
import { NavItem } from "@/types";

export default function MainNav() {
  const { userState } = useAuth();

  const navItems =
    userState === null
      ? homeConfig()
      : homeConfig(userState.userId).slice(0, 2);

  return (
    <nav>
      <ul className="hidden md:flex space-x-4 items-center">
        {navItems?.map((item: NavItem, idx: number) => {
          return (
            <li key={idx}>
              <Link
                href={item.href}
                className="text-gray-900 py-2 md:px-3 font-medium text-sm md:text-md hover:bg-gray-100"
              >
                {item.title}
              </Link>
            </li>
          );
        })}
        {!!userState && (
          <li>
            <UserIcon userConfig={userState} navItems={navItems} />
          </li>
        )}
      </ul>
      <MobileNav userConfig={userState} navItems={navItems} />
    </nav>
  );
}
