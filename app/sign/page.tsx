import { GithubLoginButton } from "./github-login-button";
import { GoogleLoginButton } from "./google-login-button";
import { KakaoLoginButton } from "./kakao-login-button";
import { NaverLoginButton } from "./naver-login-button";
import SignForm from "./sign-form";

export default function Sign() {
  return (
    <div className="grid h-full place-items-center px-10">
      <div className="flex w-full overflow-hidden rounded-md border shadow-md [&>div]:p-4">
        <div className="flex-1">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl">Book & Mark</h1>
            <span className="text-gray-500">Sign with</span>
          </div>
          <div className="my-3 mt-5 grid grid-cols-2 gap-3">
            <GoogleLoginButton />
            <GithubLoginButton />
            <NaverLoginButton />
            <KakaoLoginButton />
          </div>

          <div className='relative text-center text-gray-600 before:absolute before:top-[50%] before:left-0 before:h-[1px] before:w-[45%] before:bg-gray-200 before:content-[""] after:absolute after:top-[50%] after:right-0 after:h-[1px] after:w-[45%] after:bg-gray-200 after:content-[""]'>
            or
          </div>

          <SignForm />
        </div>

        <div className="flex-1 bg-green-500 text-white">right</div>
      </div>
    </div>
  );
}
