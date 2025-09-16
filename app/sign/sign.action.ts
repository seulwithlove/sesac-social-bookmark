"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { newToken } from "@/lib/utils";
import { validate, type ValidError } from "@/lib/validator";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";
import { sendRegistCheck } from "./mail.action";

type Provider = "google" | "github" | "naver" | "kakao";

export const login = async (provider: Provider, callback?: string) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async () => await login("naver");

export const authorize = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
    passwd: z.string().min(6, "more than 6 characters!"),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  try {
    // await signIn("credentials", formData);
    await signIn("credentials", { ...data, redirectTo: "/bookcase" });
  } catch (error) {
    console.log("💻 - sign.action.authorize - error:", error);
    throw error;
  }
};

export const loggout = async () => {
  await signOut({ redirectTo: "/sign" }); //QQQ: '/'
};

export const regist = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z
    .object({
      email: z.email(),
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
      nickname: z.string().min(3),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      message: "Passwords are not matched!",
    });
  // const x = formData.get('email') // check value type
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, nickname, passwd: orgPasswd } = data;
  const mbr = await findMemberByEmail(email);

  if (mbr)
    return {
      email: { errors: ["Duplicated Email Address"], value: email },
    };

  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();
  await prisma.member.create({
    data: { email, nickname, passwd, emailcheck },
  });

  await sendRegistCheck(email, emailcheck);

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

export const findMemberByEmail = async (
  email: string,
  passwd: boolean = false,
) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      isadmin: true,
      emailcheck: true,
      passwd,
    }, // email은 아래 써서 추가안해도됨
    where: { email },
  });
