/** biome-ignore-all lint/performance/noImgElement: img */
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: img */
import Divider from "@/components/divider";
import { use } from "react";
import { GithubLoginButton } from "./(sign-buttons)/github-login-button";
import { GoogleLoginButton } from "./(sign-buttons)/google-login-button";
import { KakaoLoginButton } from "./(sign-buttons)/kakao-login-button";
import { NaverLoginButton } from "./(sign-buttons)/naver-login-button";
import { BookImages, MarkImages, PeopleImages } from "./images";
import SignForm from "./sign-form";
import SoMany from "./so-many";

type Props = {
  searchParams: Promise<{ redirectTo: string | null }>;
};

/**
 * 📌 Sign Page - 로그인/회원가입 페이지
 *
 * 기능:
 * 1. SNS 로그인 (Google, Github, Naver, Kakao)
 * 2. 이메일/비밀번호 로그인
 * 3. 이메일/비밀번호 회원가입
 *
 * Flow:
 * - SNS 로그인: OAuth Provider → auth.ts signIn callback → Session 생성
 * - 이메일 로그인: SignForm → authorize() → auth.ts credentials provider → Session 생성
 * - 회원가입: SignForm → regist() → DB 저장 → 이메일 인증 발송
 *
 * @param searchParams.redirectTo - 로그인 후 리다이렉트할 URL (optional)
 */
export default function Sign({ searchParams }: Props) {
  const { redirectTo } = use(searchParams);

  return (
    <div className="grid h-full place-items-center px-5">
      <div className="flex w-full overflow-hidden rounded-md border shadow-md [&>div]:p-4">
        {/* 왼쪽: 로그인/회원가입 폼 영역 */}
        <div className="flex-1">
          <div className="flex items-center gap-5">
            <h1 className="font-semibold text-2xl">Book & Mark</h1>
            <span className="text-gray-500">Sign with</span>
          </div>
          {/* SNS 로그인 버튼들 */}
          <div className="my-3 mt-5 grid grid-cols-2 gap-3">
            <GoogleLoginButton />
            <GithubLoginButton />
            <NaverLoginButton redirectTo={redirectTo} />
            <KakaoLoginButton redirectTo={redirectTo} />
          </div>

          <Divider label="or" />

          {/* 이메일 로그인/회원가입 폼 */}
          <SignForm />
        </div>

        {/* 오른쪽: 서비스 소개 영역 */}
        <div className="flex-1 bg-green-500 text-white">
          <div className="flex h-full flex-col justify-around">
            <div>
              <h1 className="font-semibold text-2xl">Social BookMark,</h1>
              <h2 className="text-2xl">Record then Remember!</h2>
              <div>
                Your go-to hub for sharing and discovering great and useful
                websites. Connect with others, swap your favorite links, and
                explore a world of useful resources — all powered by this
                community
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <SoMany images={BookImages} cnt={"50K"} label={"Books"} />
              <SoMany images={MarkImages} cnt={"500K"} label={"Marks"} />
              <SoMany images={PeopleImages} cnt={"500K"} label={"Users"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
