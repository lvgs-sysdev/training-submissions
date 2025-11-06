import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { NavItem, UserItem } from "@/types";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { nextAxiosClient } from "@/lib/api/api-client";

interface ApiError {
  code?: string;
  msg: string;
}

export default function UserIcon({
  userConfig,
  navItems,
}: {
  userConfig: UserItem;
  navItems: NavItem[];
}) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await nextAxiosClient.post("/nextAuth/logout");
      logout();
    } catch (err) {
      const apiError = err as ApiError;
      toast(`エラーが発生しました。：${apiError.msg}`, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => console.log("undo"),
        },
      });
    }
  };

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Image
                src={userConfig.userIcon!}
                alt="profile"
                width={30}
                height={30}
                className="rounded-full"
              />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[10rem] gap-2">
                {navItems?.map((item: NavItem, idx: number) => {
                  return (
                    <li key={idx}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="text-gray-900 py-2 md:px-3 font-medium text-sm md:text-md hover:bg-gray-100"
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
                {!!userConfig && (
                  <li>
                    <button
                      className="text-gray-900 py-2 md:px-3 font-medium text-sm md:text-md hover:bg-gray-100 w-full text-left"
                      onClick={() => handleLogout()}
                    >
                      ログアウト
                    </button>
                  </li>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <p className="md:hidden">{userConfig.userName}</p>
    </>
  );
}
