import { SquareLibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import ThemeChanger from "@/components/theme-changer";
import { auth } from "@/lib/auth";
import DummyProfile from "@/public/profile-dummy.png";

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
        <Link href="/my" className="overflow-hidden rounded-full">
          <Image
            src={DummyProfile}
            alt={session.user?.name || "guest"}
            width={40}
            height={40}
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </div>
  );
}
