import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { use } from "react";

export default function Bookcase() {
  const session = use(auth());
  // console.log('🚀 ~ session:', session);
  const didLogin = !!session?.user?.email;
  if (!session?.user?.id) redirect("/");

  redirect(didLogin ? `/bookcase/${session.user.id}` : "/");
}
