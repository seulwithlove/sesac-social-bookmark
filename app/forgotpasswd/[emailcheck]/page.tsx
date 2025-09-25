import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import ResetPassword from "./reset-password";

// /forgotpasswd/ADFF-SADF-sadf/
export default async function ResetForgotPasswd({
  params,
}: {
  params: Promise<{ emailcheck: string }>;
}) {
  const { emailcheck } = await params;
  console.log("💻 - page.tsx - emailcheck:", emailcheck);

  const mbr = await prisma.member.findFirst({
    select: { nickname: true, emailcheck: true, email: true },
    where: { emailcheck },
  });

  if (emailcheck !== mbr?.emailcheck)
    redirect("/sign/error?error=InvalidEmailCheck");

  return (
    <div className="grid h-full place-items-center">
      <div className="w-96">
        <h1 className="mb-3 text-2xl">Change Password</h1>
        <div className="font-bold text-gray-500 text-sm">
          Hello, {mbr?.nickname}
        </div>
        <div className="mb-5 text-gray-500 text-sm">Reset your password</div>

        <ResetPassword email={mbr.email} emailcheck={emailcheck} />
      </div>
    </div>
  );
}
