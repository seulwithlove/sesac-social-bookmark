"use server";

import { createTransport } from "nodemailer";

type Attachments = {
  filename: string;
  path: string;
}[];

const { google_user: user, google_app_password: pass } = process.env;

const TRANS = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user, pass },
});

const FROM = '"BookMark" <indiflex1@gmail.com>';

export const sendRegistCheck = async (to: string, authKey: string) => {
  const subject = "[BookMark] Regist Authentication Mail";
  const html = `
    <div style="display: grid; place-items: center; height: 200px;">
      <h1>Welcome to BookMark!</h1>
      <h3 style="margin: 10px 0;">
        Please click on the link below to complete your subscription
      </h3>
      <a href="${process.env.NEXT_PUBLIC_URL}/registcheck/${authKey}?email=${to}">Regist Authentication</a>
    </div>
  `;

  return sendMail(to, subject, html);
};

export const sendPasswordReset = async (
  to: string,
  authKey: string,
  nickname?: string,
) => {
  const subject = "[Bookmark] Reset Password";
  const html = `
    <div style="display: grid; place-items: center; height: 200px;">
      <h1>Reset Password</h1>
      <h2>Hello, ${nickname}</h2>
      <h3 style="margin: 10px 0;">
        Click the link below to reset your password.
      </h3>
      <a href="${process.env.NEXT_PUBLIC_URL}/forgotpasswd/${authKey}">Reset Password</a>
    </div>
  `;

  return sendMail(to, subject, html);
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
export const sendEmailChangeCode = async (
  to: string,
  authKey: string,
  nickname?: string,
) => {
  const subject = "[Bookmark] Email Change Verification Code";
  const html = `
    <div style="display: grid; place-items: center; height: 200px;">
      <h1>Email Address Change Code</h1>
      <h2>Hello, ${nickname}</h2>
      <h3 style="margin: 10px 0; font-weight: 500;">
        Input the below code to change your email address.
      </h3>
      <h1 style="font-weight: 700; letter-spacing: 0.3rem;">${authKey}</h1>
    </div>
  `;

  return sendMail(to, subject, html);
};

const sendMail = async (
  to: string,
  subject: string,
  html: string,
  attachments?: Attachments,
) =>
  TRANS.sendMail({
    from: FROM,
    to,
    // bcc: 'indiflex.sico@gmail.com',
    subject,
    html,
    attachments,
  });
