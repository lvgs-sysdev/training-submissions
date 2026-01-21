import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

// JWTの型拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
