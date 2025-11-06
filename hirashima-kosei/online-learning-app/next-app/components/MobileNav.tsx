import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NavItem, UserItem } from "@/types";
import Link from "next/link";
import UserIcon from "./UserIcon";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { useEffect } from "react";

export default function MobileNav({
  userConfig,
  navItems,
}: {
  userConfig: UserItem | null;
  navItems: NavItem[];
}) {
  const { logout, error, setError } = useAuth();

  useEffect(() => {
    if (error) {
      toast("ログアウトに失敗しました。", {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => setError(false),
        },
      });
    }
  }, [error]);

  return (
    <ul className="flex md:hidden space-x-4 items-start">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              role="img"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
              ></path>
            </svg>
          </MenubarTrigger>
          <MenubarContent>
            {!!userConfig && (
              <li>
                <MenubarItem className="ps-0">
                  <UserIcon userConfig={userConfig} navItems={navItems} />
                </MenubarItem>
              </li>
            )}
            {navItems?.map((item: NavItem, idx: number) => {
              return (
                <li key={idx}>
                  <MenubarItem>
                    <Link
                      href={item.href}
                      className="text-gray-900 py-2 md:px-3 font-medium text-sm md:text-md hover:bg-gray-100"
                    >
                      {item.title}
                    </Link>
                  </MenubarItem>
                </li>
              );
            })}
            {!!userConfig && (
              <li>
                <MenubarItem>
                  <button
                    className="text-gray-900 py-2 md:px-3 font-medium text-sm md:text-md hover:bg-gray-100 w-full text-left"
                    onClick={() => logout()}
                  >
                    ログアウト
                  </button>
                </MenubarItem>
              </li>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ul>
  );
}
