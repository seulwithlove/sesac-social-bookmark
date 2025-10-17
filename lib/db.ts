import { PrismaClient } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

export default prisma;

export const findMemberByEmail = async (
  email: string,
  isIncludePasswd: boolean = false,
) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      isadmin: true,
      emailcheck: true,
      image: true,
      outdt: true,
      passwd: isIncludePasswd,
    },
    where: { email },
  });
