import { PrismaClient } from "@/lib/generated/prisma/client";

// Singleton
const newInstance = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: too many connections problem
declare const globalThis: {
  prismaGlobal: ReturnType<typeof newInstance>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? newInstance();
export default prisma;
globalThis.prismaGlobal = prisma; // set

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

export type Member = Awaited<ReturnType<typeof findMemberById>>;
export type MemberWithCount = Awaited<
  ReturnType<typeof findMemberByIdWithCount>
>;

export const findMemberById = async (id: number | string) =>
  prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      image: true,
      isadmin: true,
      email: true,
    },
    where: { id: Number(id) },
  });

export const findMemberByIdWithCount = async (id: number | string) => {
  return prisma.member.findUnique({
    select: {
      id: true,
      nickname: true,
      image: true,
      isadmin: true,
      email: true,
      _count: { select: { Book: true, Mark: true } },
    },
    where: { id: Number(id) },
  });
};

// book
export type BookAllColumn = Awaited<ReturnType<typeof findBookWithMarkById>>;

export const findBookById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
  });
export const findBookWithMarkById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
    include: { Mark: true },
  });
