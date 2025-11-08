/** biome-ignore-all lint/correctness/useJsxKeyInIterable: img tag */
/** biome-ignore-all lint/performance/noImgElement: img tag */
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

export default function Sign({ searchParams }: Props) {
  const { redirectTo } = use(searchParams);

  return (
    <div className="container mx-auto mt-16 grid h-full max-w-[700px] place-items-center">
      <div className="flex w-full flex-col-reverse overflow-hidden rounded-md border shadow-md sm:flex-row [&>div]:p-4">
        <div className="flex-1">
          <div className="flex items-center gap-5">
            <h1 className="font-semibold text-2xl">Book & Mark</h1>
            <span className="text-gray-500">Sign with</span>
          </div>
          <div className="mt-5 mb-2 grid grid-cols-2 gap-3">
            <GoogleLoginButton />
            <GithubLoginButton />
            <NaverLoginButton redirectTo={redirectTo} />
            <KakaoLoginButton redirectTo={redirectTo} />
          </div>

          <Divider label="or" />

          <SignForm />
        </div>

        <div className="flex-1 bg-green-500 text-white">
          <div className="flex h-full flex-col justify-around">
            <div>
              <h1 className="font-semibold text-2xl">Social BookMark,</h1>
              <h2 className="text-2xl">Record than Remember!</h2>
              <div>
                Your go-to hub for sharing and discovering great and useful websites.
                Connect with others, swap your favorite links, and explore a world of
                useful resources — all powered by this community
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
