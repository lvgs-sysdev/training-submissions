"use client";

import Link from "next/link";

type Props = {
  name: string;
  href: string;
};
export default function Nav({ name, href }: Readonly<Props>) {
  return (
    <Link
      href={href}
      aria-label={name}
      title={name}
      className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:text-deep-purple-accent-400"
    >
      {name}
    </Link>
  );
}
