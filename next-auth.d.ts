import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      isadmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    passwd?: string; // (: callbacks > signIn에서 password 비교)
    isadmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isadmin?: boolean;
  }
}
