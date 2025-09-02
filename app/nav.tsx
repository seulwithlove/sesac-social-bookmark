import { SquareLibraryIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import ThemeChanger from "@/components/theme-changer";
import { auth } from "@/lib/auth";

export default function Nav() {
  const session = use(auth());
  const didLogin = !!session?.user;
  return (
    <div className="flex items-center gap-5 py-1">
      <Link href="/bookcase" className="btn-icon">
        <SquareLibraryIcon />
      </Link>
      <ThemeChanger />
      {didLogin ? (
        <Link href="/my" className="">
          {session.user?.name}
        </Link>
      ) : (
        <Link href="/api/auth/signin">Login</Link>
      )}
    </div>
  );
}
