"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { LoaderPinwheelIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useReducer, useRef } from "react";
import { authorize, regist } from "./sign.action";

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

function SignIn({ toggleSign }: { toggleSign: () => void }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const redirectTo = searchParams.get("redirectTo");

  const passwdRef = useRef<HTMLInputElement>(null);

  const [validError, makeLogin, isPending] = useActionState(
    authorize,
    undefined,
  );

  const makeLoginAction = (formData: FormData) => {
    if (redirectTo) formData.set("redirectTo", redirectTo);
    makeLogin(formData);
  };

  useEffect(() => {
    if (email) {
      passwdRef.current?.focus();
    }
  }, [email]);

  return (
    <>
      <form action={makeLogin} className="flex flex-col space-y-3">
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}
        <LabelInput
          label="email"
          type="email"
          name="email"
          focus={true}
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

// const dummy = {
//   email: "lee.seeul.00@gmail.com",
//   // email: "rosily313@gmail.com",
//   passwd: "121212",
//   passwd2: "121212",
//   nickname: "seul",
// };

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
