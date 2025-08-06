"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
  href: string;
  name: string;
};

export default function Nav({ href, name }: Readonly<Props>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-label={name}
      title={name}
      className={clsx(
        // 基本のスタイル
        "px-2 py-2 rounded-md font-medium tracking-wide transition-all duration-300",
        // 条件付きのスタイル
        {
          "bg-sky-100 text-sky-700": pathname === href, // アクティブ時のスタイル
          "text-gray-700 hover:bg-sky-700 hover:text-white hover:-translate-y-0.5":
            pathname !== href, // 非アクティブ時のスタイル
        }
      )}
    >
      {name}
    </Link>
  );
}
