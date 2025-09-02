"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { loggout } from "@/app/sign/sign.action";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const session = useSession();
  if (!session?.data?.user) redirect("/");

  return (
    <Button onClick={loggout} variant={"success"}>
      Sign Out {session.data?.user?.name}
    </Button>
  );
}
