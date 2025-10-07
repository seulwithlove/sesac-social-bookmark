import {
  sendEmailChangeCode,
  sendPasswordReset,
  sendRegistCheck,
} from "@/app/sign/mail.action";
import { newToken } from "@/lib/utils";
import { NextResponse, type NextRequest } from "next/server";

export type SendMailBody = {
  email: string;
  emailcheck: string;
  nickname?: string;
  emailType?: "regist" | "reset-password" | "email-change-code";
};

export function GET() {
  return NextResponse.json({ token: newToken() });
}

// POST /api/sendmail 하면 무조건 메일 발송됨
export async function POST(req: NextRequest) {
  const {
    email,
    emailcheck,
    nickname,
    emailType = "regist",
  }: SendMailBody = await req.json();

  // 보안키 필요
  const authorization = req.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.INTERNAL_SECRET}`)
    throw new Error("InvalidToken");

  const rs =
    emailType === "regist"
      ? await sendRegistCheck(email, emailcheck)
      : emailType === "reset-password"
        ? await sendPasswordReset(email, emailcheck, nickname)
        : await sendEmailChangeCode(email, emailcheck, nickname);

  return NextResponse.json(rs);
}
