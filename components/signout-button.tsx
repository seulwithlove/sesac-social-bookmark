"use client";

import { loggout } from "@/app/sign/sign.action";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const session = useSession();

  return (
    <Button onClick={loggout} variant={"success"}>
      Sign Out {session.data?.user?.name}
    </Button>
  );
}
