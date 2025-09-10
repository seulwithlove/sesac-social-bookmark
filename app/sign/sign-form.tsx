"use client";

import Link from "next/link";
import { useReducer } from "react";
import z from "zod";
import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import { authorize } from "./sign.action";

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
  const makeLogin = async (formData: FormData) => {
    // const email = formData.get("email");
    // const passwd = formData.get("passwd");

    // const validator = z
    //   .object({
    //     email: z.email("잘못된 이메일 형식입니다"),
    //     passwd: z.string().min(6, "more than 6 characters!"),
    //   })
    //   .safeParse(Object.fromEntries(formData.entries()));

    // if (!validator.success) {
    //   console.log("Error:", validator.error);
    //   return alert(validator.error);
    // }

    await authorize(formData);
  };

  return (
    <>
      <form action={makeLogin} className="flex flex-col space-y-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          defaultValue={"love.and.seul@gmail.com"}
          placeholder="email@bookmark.com"
        />

        <LabelInput
          label="password"
          type="password"
          name="passwd"
          placeholder="your password"
          defaultValue={"121212"}
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

          <Link href="#">Forgot Password?</Link>
        </div>

        <Button type="submit" variant={"primary"} className="w-full">
          login
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

function SignUp({ toggleSign }: { toggleSign: () => void }) {
  return (
    <>
      {" "}
      <form className="flex flex-col gap-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          placeholder="your password"
          className="my-3x"
        />

        <Button type="submit" variant={"primary"} className="w-full">
          Sign Up
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
