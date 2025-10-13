"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { LoaderPinwheelIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef } from "react";
import { authorize, regist } from "./sign.action";

/**
 * 📌 SignForm - 로그인/회원가입 폼 전환 컴포넌트
 *
 * 로그인과 회원가입 폼을 토글로 전환하는 최상위 컴포넌트
 */
export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, true);
  return (
    <>
      {isSignin ? (
        <SignIn toggleSign={toggleSign} />
      ) : (
        <SignUp toggleSign={toggleSign} />
      )}
    </>
  );
}

/**
 * 🔑 Remember Me - 이메일 저장/불러오기 함수
 *
 * 로컬스토리지에 이메일을 저장하여 다음 로그인 시 자동 입력
 */
const storeEmail = (email: string | null) =>
  email === null
    ? localStorage.removeItem("SBM_LOCAL_EMAIL")
    : localStorage.setItem("SBM_LOCAL_EMAIL", email);

const readEmail = () => localStorage.getItem("SBM_LOCAL_EMAIL"); // 저장된 이메일 불러오기

/**
 * 📌 SignIn - 로그인 폼 컴포넌트
 *
 * Flow:
 * 1. 사용자가 이메일/비밀번호 입력
 * 2. Remember Me 체크 시 이메일을 로컬스토리지에 저장
 * 3. authorize() 서버 액션 호출
 * 4. NextAuth credential provider에서 인증 처리
 * 5. auth.ts의 signIn callback 실행 → DB 검증
 * 6. 성공 시 Session 생성 및 redirectTo로 이동
 *
 * @param toggleSign - 회원가입 폼으로 전환하는 함수
 */
function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirectTo = searchParams.get("redirectTo");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);
  const rememberRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [validError, makeLogin, isPending] = useActionState(
    authorize,
    undefined,
  );

  const makeLoginAction = async (formData: FormData) => {
    rememberMe(); // 이메일 저장 처리

    if (redirectTo) formData.set("redirectTo", redirectTo); // redirectTo를 formData에 추가 (hidden input으로 노출하지 않음)
    await makeLogin(formData); // authorize() 호출 (await 필수!)
    router.refresh(); // 페이지 새로고침으로 Session 반영
  };

  /**
   * Remember Me 체크박스 처리
   * - 체크되어 있으면 이메일을 로컬스토리지에 저장
   * - 체크 해제되어 있으면 로컬스토리지에서 삭제
   */
  const rememberMe = () => {
    if (rememberRef.current?.checked && emailRef.current?.value)
      storeEmail(emailRef.current.value);
    else storeEmail(null);
  };

  useEffect(() => {
    const storedEmail = readEmail();
    if (rememberRef.current) rememberRef.current.checked = !!storedEmail;
    if (emailRef.current && storedEmail) emailRef.current.value = storedEmail;

    if (email || storedEmail) {
      passwdRef.current?.focus();
    }
  }, [email]);

  return (
    <>
      <form action={makeLoginAction} className="flex flex-col space-y-3">
        {/* {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )} */}
        <LabelInput
          label="email"
          type="email"
          name="email"
          focus={true}
          ref={emailRef}
          error={validError}
          defaultValue={email || ""}
          placeholder="email@bookmark.com"
        />

        <LabelInput
          label="password"
          type="password"
          name="passwd"
          ref={passwdRef}
          error={validError}
          // defaultValue={"121212"}
          placeholder="your password"
          className="my-3x"
        />

        <div className="flex justify-between">
          <label htmlFor="remember" className="cursor-pointer">
            <input
              type="checkbox"
              id="remember"
              ref={rememberRef}
              onChange={rememberMe}
              className="mr-1 translate-y-[1px]"
            />
            Remember me
          </label>

          <Link href="/forgotpasswd">Forgot Password?</Link>
        </div>

        <Button
          type="submit"
          variant={"primary"}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Singing..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Don&apos;t have account?</span>
        <Link onClick={toggleSign} href="#">
          Sign Up
        </Link>
      </div>
    </>
  );
}

/**
 * 📌 SignUp - 회원가입 폼 컴포넌트
 *
 * Flow:
 * 1. 사용자가 이메일/닉네임/비밀번호/비밀번호확인 입력
 * 2. regist() 서버 액션 호출
 * 3. 유효성 검사 (이메일 중복, 비밀번호 일치 등)
 * 4. DB에 회원 정보 저장 (emailcheck 토큰 포함)
 * 5. sendmailByFetch()로 이메일 인증 메일 발송
 * 6. /sign/error?error=CheckEmail 페이지로 리다이렉트 (이메일 확인 안내)
 *
 * @param toggleSign - 로그인 폼으로 전환하는 함수
 */
function SignUp({ toggleSign }: { toggleSign: () => void }) {
  const [validError, makeRegist, isPending] = useActionState(regist, undefined);

  return (
    <>
      <form action={makeRegist} className="flex flex-col gap-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          focus={true}
          error={validError}
          // defaultValue={dummy.email}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="nickname"
          type="nickname"
          name="nickname"
          error={validError}
          // defaultValue={dummy.nickname}
          placeholder="your nickname"
          className="my-3x"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          error={validError}
          // defaultValue={dummy.passwd}
          placeholder="your password"
          className="my-3x"
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd2"
          error={validError}
          // defaultValue={dummy.passwd2}
          placeholder="your password"
          className="my-3x"
        />

        <Button
          disabled={isPending}
          type="submit"
          variant={"primary"}
          className="w-full"
        >
          {isPending ? "Singing up..." : "Sign Up"}
          {isPending && <LoaderPinwheelIcon className="animate-spin" />}
        </Button>
      </form>
      <div className="mt-5 flex gap-10">
        <span>Already have account?</span>
        <Link href="#" onClick={toggleSign}>
          Sign In
        </Link>
      </div>
    </>
  );
}
