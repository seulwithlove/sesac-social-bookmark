"use client";

import LabelInput from "@/components/label-input";
import { Button } from "@/components/ui/button";
import type { ValidError } from "@/lib/validator";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useActionState, useReducer } from "react";
import z from "zod";
import { authorize } from "./sign.action";

export default function SignForm() {
  const [isSignin, toggleSign] = useReducer((pre) => !pre, false);
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
          defaultValue={"anfrhrl0313@naver.com"}
          placeholder="email@bookmark.com"
        />

        <LabelInput
          label="password"
          type="password"
          name="passwd"
          defaultValue={"121212"}
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
  const [validError, makeRegist, isPending] = useActionState(
    async (_preValidError: ValidError | undefined, formData: FormData) => {
      const validator = z
        .object({
          email: z.email(),
          passwd: z.string().min(6),
          passwd2: z.string().min(6),
          nickname: z.string().min(3),
        })
        .refine(
          ({ passwd, passwd2 }) => passwd === passwd2,
          "Passwords are not matched!",
        )
        .safeParse(Object.fromEntries(formData.entries()));

      if (!validator.success) {
        const err = z.treeifyError(validator.error).properties;
        return err;
      }
    },
    undefined,
  );

  return (
    <>
      <form action={makeRegist} className="flex flex-col gap-3">
        <LabelInput
          label="email"
          type="email"
          name="email"
          focus={true}
          error={validError}
          placeholder="email@bookmark.com"
        />
        <LabelInput
          label="password"
          type="password"
          name="passwd"
          error={validError}
          placeholder="your password"
          className="my-3x"
        />
        <LabelInput
          label="password confirm"
          type="password"
          name="passwd"
          error={validError}
          placeholder="your password"
          className="my-3x"
        />
        <LabelInput
          label="nickname"
          type="nickname"
          name="nickname"
          error={validError}
          placeholder="your nickname"
          className="my-3x"
        />

        <Button
          disabled={isPending}
          type="submit"
          variant={"primary"}
          className="w-full"
        >
          {isPending ? "Singing up..." : "Sign Up"}
          {isPending && <LoaderPinwheel className="animate-spin" />} Sign Up
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
