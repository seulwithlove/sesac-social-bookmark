import ThemeChanger from "@/components/theme-changer";
import { auth } from "@/lib/auth";
import { DummyProfile } from "@/lib/utils";
import { existsFile } from "@/lib/validator";
import { SquareLibraryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

/**
 * 📌 Nav - 네비게이션 바 (헤더)
 *
 * 기능:
 * 1. Bookcase 링크 (메인 페이지)
 * 2. 테마 변경 (ThemeChanger)
 * 3. 로그인 상태:
 *    - 프로필 이미지 표시 → My 페이지 링크
 * 4. 로그아웃 상태:
 *    - "Login" 링크 → Sign 페이지
 *
 * Flow:
 * 1. auth()로 Session 확인 (서버 컴포넌트)
 * 2. didLogin = !!session?.user로 로그인 여부 판단
 * 3. 로그인 상태에 따라 UI 분기
 *    - 로그인: 프로필 이미지 (existsFile로 파일 존재 여부 확인)
 *    - 로그아웃: "Login" 텍스트 링크
 *
 * 서버 컴포넌트: auth()를 직접 호출하여 Session 확인
 */
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
            src={existsFile(session.user?.image) || DummyProfile} // DummyProfile: import해서 사용하기때문에 나옴
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
