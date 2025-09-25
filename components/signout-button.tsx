"use client";

import { loggout } from "@/app/sign/sign.action";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutButton({ name }: { name: string }) {
  const session = useSession();
  // session.update(); // rerendering : bad!

  return (
    <Button onClick={loggout} variant={"success"}>
      Sign Out {name}
    </Button>
  );
}
