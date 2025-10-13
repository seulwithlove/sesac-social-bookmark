"use client";

import { logout } from "@/app/sign/sign.action";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function SignOutButton({ name }: { name: string }) {
  return (
    <form action={logout}>
      <Button variant={"success"}>
        {/* <LogOutIcon /> Sign out {name} */}
        <LogOutIcon /> Sign out
      </Button>
    </form>
  );
}
