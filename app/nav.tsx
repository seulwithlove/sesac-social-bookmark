import ThemeChanger from "@/components/theme-changer";
import { auth } from "@/lib/auth";
import DummyProfile from "@/public/profile-dummy.png";
import { SquareLibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

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
        <Link
          href="/my"
          className="relative h-[40px] w-[40px] overflow-hidden rounded-full"
        >
          <Image
            src={session.user.image || DummyProfile} // DummyProfile: import해서 사용하기떄문에 나옴
            alt={session.user?.name || "guest"}
            unoptimized={process.env.NODE_ENV === "development"} // next가 찾는걸 방지
            fill
          />
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </div>
  );
}
