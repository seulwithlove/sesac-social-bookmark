"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma, { findMemberByEmail } from "@/lib/db";
import { newToken, uniqId } from "@/lib/utils";
import { validate, type ValidError } from "@/lib/validator";
import { hash } from "bcryptjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import z from "zod";
import type { SendMailBody } from "../api/sendmail/route";

export type Provider = "google" | "github" | "naver" | "kakao";

/**
 * 📌 login - SNS 로그인 함수
 *
 * NextAuth signIn()을 호출하여 OAuth 로그인 시작
 *
 * Flow:
 * 1. signIn(provider) 호출
 * 2. OAuth Provider로 리다이렉트 (Google, Github 등)
 * 3. 사용자 인증 후 callback URL로 돌아옴
 * 4. auth.ts의 signIn callback 실행 → DB 확인/생성
 * 5. Session 생성 후 redirectTo로 이동
 *
 * @param provider - OAuth provider (google, github, naver, kakao)
 * @param callback - 로그인 성공 후 이동할 URL
 */
export const login = async (provider: Provider, callback?: string | null) => {
  await signIn(provider, { redirectTo: callback || "/bookcase" });
};

export const loginNaver = async (redirectTo?: string | null) =>
  login("naver", redirectTo);

/**
 * 📌 authorize - 이메일/비밀번호 로그인 (Credential 방식)
 *
 * Flow:
 * 1. formData에서 email, passwd 추출 및 유효성 검사
 * 2. signIn('credentials', data) 호출
 * 3. auth.ts의 Credential provider로 전달
 * 4. auth.ts의 signIn callback 실행:
 *    - DB에서 이메일로 회원 조회
 *    - 이메일 미인증 시 에러 페이지로 리다이렉트
 *    - 비밀번호 검증 (bcrypt compare)
 *    - 탈퇴한 회원 체크
 * 5. 성공 시 Session 생성 및 redirectTo로 이동
 *
 * @param formData - email, passwd, redirectTo(optional)
 * @returns ValidError | undefined
 */
export const authorize = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  // 1. 입력 데이터 유효성 검사
  const zobj = z.object({
    email: z.email(),
    passwd: z.string().min(6, "More than 6 characters!"),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  try {
    const redirectTo = formData.get("redirectTo")?.toString() || "/bookcase";

    // 2. NextAuth singIn() 호출 → auth.ts credentials provider 실행
    await signIn("credentials", { ...data, redirectTo });
  } catch (error) {
    // 3. AuthError 처리 (auth.ts에서 throw된 에러)
    if (error instanceof AuthError) {
      let typeErr: string;
      switch (error.type) {
        case "AccessDenied":
        case "EmailSignInError":
          typeErr = error.message.split("Read more")[0];
          break;
        case "OAuthAccountNotLinked":
          typeErr = `Already registed SNS Account`;
          break;
        case "CredentialsSignin":
          typeErr =
            error.message.split("Read more")[0] ||
            "Not match Email or Password!";
          break;
        default:
          typeErr = error.message || "Something went wrong!";
      }

      return {
        email: { errors: [typeErr], value: data.email },
        passwd: { errors: [], value: data.passwd },
      } as ValidError;
    }
    throw error;
  }
};

/**
 * 📌 logout - 로그아웃
 *
 * NextAuth signOut()을 호출하여 세션 삭제 및 로그인 페이지로 리다이렉트
 */
export const logout = async () => {
  await signOut({ redirectTo: "/sign" }); // QQQ: '/'
};

/**
 * 📌 regist - 회원가입
 *
 * Flow:
 * 1. formData에서 email, nickname, passwd, passwd2 추출 및 유효성 검사
 * 2. 비밀번호 일치 여부 확인
 * 3. 이메일 중복 확인 (existsEmail)
 * 4. 비밀번호 해싱 (bcrypt)
 * 5. DB에 회원 정보 저장 (emailcheck 토큰 포함)
 * 6. 이메일 인증 메일 발송 (sendmailByFetch)
 * 7. 이메일 확인 안내 페이지로 리다이렉트
 *
 * @param formData - email, nickname, passwd, passwd2
 * @returns ValidError | undefined
 */
export const regist = async (
  _preValidError: ValidError | undefined,
  formData: FormData,
) => {
  // 1. 입력 데이터 유효성 검사 + 비밀번호 일치 확인
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

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  // 2. 이메일 중복 확인
  const { email, nickname, passwd: orgPasswd } = data;
  const mbr = await findMemberByEmail(email);
  if (mbr)
    return {
      email: { errors: ["Duplicated Email Address!"], value: email },
    };

  // 3. 비밀번호 해싱 + emailcheck 토큰 생성
  const passwd = await hash(orgPasswd, 10);
  const emailcheck = newToken();

  // 4. DB에 회원 정보 저장
  await prisma.member.create({
    data: { email, nickname, passwd, emailcheck },
  });

  // 5. 이메일 인증 메일 발송 (fetch로 /api/sendmail 호출)
  sendmailByFetch({ email, emailcheck });

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

/**
 * 📌 sendResetPassword - 비밀번호 재설정 이메일 발송
 *
 * Flow:
 * 1. 이메일 입력 및 유효성 검사
 * 2. DB에 emailcheck 토큰 업데이트
 * 3. 비밀번호 재설정 이메일 발송
 * 4. 이메일 확인 안내 페이지로 리다이렉트
 */
export const sendResetPassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const emailcheck = newToken();
  const { email } = data;
  const { nickname } = await prisma.member.update({
    select: { nickname: true },
    where: { email },
    data: { emailcheck },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType: "reset-password",
  });

  if (!rs.ok) return { email: { errors: ["Fail to send email!"] } };

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

/**
 * 📌 resetPassword - 비밀번호 재설정
 *
 * Flow:
 * 1. 이메일, emailcheck 토큰, 새 비밀번호 유효성 검사
 * 2. 비밀번호 일치 확인
 * 3. 비밀번호 해싱 및 DB 업데이트 (emailcheck 토큰 제거)
 * 4. 완료 페이지로 리다이렉트
 */
export const resetPassword = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z
    .object({
      email: z.email(),
      emailcheck: z.uuidv4(),
      passwd: z.string().min(6),
      passwd2: z.string().min(6),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      message: "Not Match Passoword and Password confirm!",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, passwd2, emailcheck } = data;
  const passwd = await hash(passwd2, 10);

  await prisma.member.update({
    where: { email, emailcheck },
    data: { passwd, emailcheck: null },
  });

  redirect(`/sign/error?error=Your password changed.`);
};

/**
 * 📌 resendRegist - 이메일 인증 메일 재발송
 *
 * 이메일 인증을 못 받은 경우 재발송
 */
export const resendRegist = async (
  _: ValidError | undefined,
  formData: FormData,
) => {
  const zobj = z.object({
    email: z.email(),
    emailcheck: z.uuidv4(),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, emailcheck } = data;
  const mbr = await findMemberByEmail(email);
  if (!mbr || mbr.emailcheck !== emailcheck) {
    redirect("/sign/error?error=EmailSendFail");
  }

  const newEmailCheck = newToken();
  await prisma.member.update({
    where: { email },
    data: { emailcheck: newEmailCheck },
  });

  const rs = await sendmailByFetch({
    email,
    emailcheck: newEmailCheck,
  });
  if (!rs.ok) return { email: { errors: ["Fail to send email!"] } };

  redirect(`/sign/error?error=CheckEmail&email=${email}`);
};

/**
 * 📌 sendmailByFetch - 이메일 발송 (내부 API 호출)
 *
 * /api/sendmail POST 엔드포인트를 호출하여 이메일 발송
 * - 회원가입 인증 메일
 * - 비밀번호 재설정 메일
 * - 이메일 변경 인증 코드 메일
 *
 * @param email - 수신 이메일
 * @param emailcheck - 인증 토큰 or 인증 코드
 * @param nickname - 닉네임 (optional)
 * @param emailType - 이메일 타입 (regist, reset-password, email-change-code)
 */
const sendmailByFetch = async ({
  email,
  emailcheck,
  nickname,
  emailType = "regist",
}: SendMailBody) => {
  const { NEXT_PUBLIC_URL, INTERNAL_SECRET } = process.env;
  return fetch(`${NEXT_PUBLIC_URL}/api/sendmail`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${INTERNAL_SECRET}`,
    },
    body: JSON.stringify({ email, emailcheck, nickname, emailType }),
  });
};

export type UpdateProfileImageTypeReturn = ReturnType<
  typeof updateProfileImage
>;

<<<<<<< Updated upstream
=======
  const { email } = session.user;
  const mbr = await findMemberByEmail(email);

  const zobj = z
    .object({
      nickname: z.string().min(3),
      newEmail: z.email(),
      curr_passwd: z.string().min(6).optional(),
      passwd: z.string().min(6).optional(),
      passwd2: z.string().min(6).optional(),
    })
    .refine(
      ({ curr_passwd, passwd, passwd2 }) => {
        return (
          (!curr_passwd && !passwd && !passwd2) ||
          (curr_passwd && passwd && passwd2)
        );
      },
      { path: ["passwd2"], message: "Input the all password to change!" },
    )
    .refine(({ curr_passwd, passwd, passwd2 }) => {
      if (curr_passwd && passwd && passwd2 && mbr?.passwd) {
        return passwd === passwd2;
      }
      return true;
    });

  const [err, data] = validate(zobj, formData);
  console.log("💻 - sign.action.ts - err, data:", err, data);

  if (err) return err;

  const dataErr: ValidError = {};
  for (const [key, value] of Object.entries(data)) {
    dataErr[key] = { errors: [], value };
  }

  const { newEmail, nickname, curr_passwd } = data;
  if (mbr?.passwd && curr_passwd) {
    const validCurrPasswd = await comparePassword(mbr?.passwd, curr_passwd);
    if (!validCurrPasswd)
      return {
        ...dataErr,
        curr_passwd: {
          errors: ["Invalid current password!"],
          value: curr_passwd,
        },
      };
  }

  const existsErr = await existsEmail(newEmail, "newEmail");
  // console.log('****', { ...dataErr, ...existsErr });
  if (existsErr) return { ...dataErr, ...existsErr };

  const emailcheck = uniqNumId();
  await prisma.member.update({
    where: { email },
    data: { emailcheck },
  });

  setTimeout(
    async () => {
      await prisma.member.update({
        where: { email },
        data: { emailcheck: null },
      });
    },
    2 * 60 * 1000,
  );

  await sendmailByFetch({
    email,
    emailcheck,
    nickname,
    emailType: "email-change-code",
  });

  return dataErr;
};

/**
 * 📌 updateProfileImage - 프로필 이미지 변경
 *
 * Flow:
 * 1. Session에서 사용자 정보 확인
 * 2. formData에서 이미지 파일 추출 및 유효성 검사 (10MB 이하, 이미지만)
 * 3. public/profiles/ 폴더에 파일 저장
 * 4. DB에 이미지 경로 업데이트
 * 5. revalidatePath()로 캐시 무효화
 *
 * @param formData - image (File)
 * @returns [ValidError | null, Member | null]
 */
export type UpdateProfileImageReturn = ReturnType<typeof updateProfileImage>;
>>>>>>> Stashed changes
export const updateProfileImage = async (formData: FormData) => {
  // 1. Session 확인
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  const { id, email } = session.user;
  const ent = Object.fromEntries(formData.entries());
<<<<<<< Updated upstream
  console.log("🚀 ~ ent:", ent);
=======
  console.log("💻 - sign.action.ts - ent:", ent);

  // 2. 이미지 파일 유효성 검사
>>>>>>> Stashed changes
  const zobj = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "Under 10MB!")
      .refine((file) => file.type.startsWith("image/"), "Upload Image only!"),
  });

  const [err, data] = validate(zobj, formData);
  // console.log('🚀 ~ err:', err);
  // console.log('🚀 ~ data:', data);
  if (err) return [err];

  // 3. 파일 저장 (public/profiles/)
  const uploadDir = path.join(process.cwd(), "public", "profiles");
  if (!existsSync(uploadDir)) mkdirSync(uploadDir);

  const fileName = `${id}_${uniqId()}_${data.image.name}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await data.image.arrayBuffer());
  await writeFile(filePath, buffer);
  const image = `/profiles/${fileName}`;

  // 4. Update DB
  const mbr = await prisma.member.update({
    where: { email },
    data: { image },
  });

  // 5. 캐시 무효화
  revalidatePath("/profiles");

<<<<<<< Updated upstream
  return [null, mbr]; // ValidError, mbr
=======
  return [null, mbr];
};

/**
 * 📌 updateNickname - 닉네임 변경
 *
 * Flow:
 * 1. Session 확인
 * 2. formData에서 nickname 추출 및 유효성 검사
 * 3. DB 업데이트
 * 4. 업데이트된 회원 정보 반환 (Session 업데이트용)
 *
 * @param formData - nickname
 * @returns [ValidError | null, Member | null]
 */
export const updateNickname = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  const { email } = session.user;

  const zobj = z.object({
    nickname: z.string().min(3),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err, null] as const;

  const { nickname } = data;
  const mbr = await prisma.member.update({
    where: { email },
    data: { nickname },
  });
  return [err, mbr] as const;
};

/**
 * 📌 sendEmailChangeCode - 이메일 변경 인증 코드 발송
 *
 * Flow:
 * 1. Session 확인
 * 2. formData에서 newEmail 추출 및 유효성 검사
 * 3. 새 이메일 중복 확인 (existsEmail)
 * 4. 5자리 숫자 인증 코드 생성 (uniqNumId)
 * 5. DB에 emailcheck 업데이트 (기존 이메일 기준)
 * 6. 2분 후 emailcheck 자동 삭제 (setTimeout)
 * 7. 새 이메일로 인증 코드 발송
 *
 * @param formData - newEmail
 * @returns ValidError | undefined
 */
export const sendEmailChangeCode = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  const { email, name } = session.user;
  const mbr = await findMemberByEmail(email);

  const zobj = z.object({
    newEmail: z.email(),
  });
  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { newEmail } = data;
  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return existsErr;

  const emailcheck = uniqNumId();
  await prisma.member.update({
    where: { email },
    data: { emailcheck },
  });

  setTimeout(
    async () => {
      await prisma.member.update({
        where: { email },
        data: { emailcheck: null },
      });
    },
    2 * 60 * 1000,
  );

  await sendmailByFetch({
    email: newEmail,
    emailcheck,
    nickname: name || "",
    emailType: "email-change-code",
  });
};

/**
 * 📌 updateEmail - 이메일 변경 (인증 코드 확인 후)
 *
 * Flow:
 * 1. Session 확인
 * 2. DB에서 기존 이메일로 회원 조회
 * 3. emailcheck(인증 코드)가 5자리인지 확인
 * 4. formData에서 newEmail, emailChangeCode 추출
 * 5. 입력된 인증 코드와 DB의 emailcheck 비교 (z.literal 사용)
 * 6. 새 이메일 중복 확인
 * 7. DB 업데이트: 이메일 변경 + emailcheck 제거
 * 8. 업데이트된 회원 정보 반환 (Session 업데이트용)
 *
 * @param formData - newEmail, emailChangeCode
 * @returns [ValidError | null, Member | null]
 */
export const updateEmail = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email) throw new Error("Need Login!");

  console.log("updateEmail ****>>", Object.fromEntries(formData.entries()));
  const { email } = session.user;
  const mbr = await findMemberByEmail(email);
  if (!mbr || !mbr.emailcheck || mbr.emailcheck.length !== 5) {
    return [
      {
        emailChangeCode: { errors: ["Invalid Code!"] },
      } as ValidError,
      null,
    ] as const;
  }

  // 디버깅: 입력된 코드와 저장된 코드 비교
  const inputCode = formData.get("emailChangeCode")?.toString()?.trim() || "";
  // console.log("🚀 ~ input code:", `"${inputCode}"`);
  // console.log("🚀 ~ stored code:", `"${mbr.emailcheck}"`);
  // console.log("🚀 ~ codes match:", inputCode === mbr.emailcheck);

  const zobj = z.object({
    newEmail: z.email(),
    // emailChangeCode: z.literal(mbr.emailcheck, 'Invalid Code!'),
    emailChangeCode: z.literal(mbr.emailcheck),
  });
  const [err, data] = validate(zobj, formData);
  console.log("🚀 ~ err:", err);
  if (err) return [err, null] as const;

  const { newEmail } = data;
  const existsErr = await existsEmail(newEmail, "newEmail");
  if (existsErr) return [existsErr, null] as const;

  const newMbr = await prisma.member.update({
    where: { email },
    data: { email: newEmail, emailcheck: null },
  });
  console.log("🚀 ~ newMbr:", newMbr);
  return [null, newMbr] as const;
>>>>>>> Stashed changes
};
