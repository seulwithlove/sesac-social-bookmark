import prisma, { findMemberByEmail } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ emailcheck: string }>;
  searchParams: Promise<{ email: string }>;
};

export default async function RegistCheck({ params, searchParams }: Props) {
  const { emailcheck } = await params;
  const { email } = await searchParams;

  const mbr = await findMemberByEmail(email);
  console.log("💻 - page.tsx - mbr:", mbr);

  if (emailcheck !== mbr?.emailcheck)
    redirect("/sign/error?error=InvalidEmailCheck");

  await prisma.member.update({
    where: { email },
    data: { emailcheck: null },
  });

  redirect(`/sign?email=${email}`);
}
