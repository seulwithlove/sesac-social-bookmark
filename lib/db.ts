"only server";

// export type { Book, Likes, Member } from '@/lib/generated/prisma/client';
import { PrismaClient } from "@/lib/generated/prisma/client";

const newInstance = () => new PrismaClient();

// biome-ignore lint/suspicious/noShadowRestrictedNames: for too many connections problems
declare const globalThis: {
  prismaGlobal: ReturnType<typeof newInstance>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? newInstance();

export default prisma;
globalThis.prismaGlobal = prisma;

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

export type MemberWithCount = Awaited<ReturnType<typeof findMemberByIdWithCount>>;

export const findMemberById = async (id: number | string) =>
  prisma.member.findUnique({
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      isadmin: true,
    },
    where: { id: Number(id) },
  });

export const findMemberByIdWithCount = async (id: number | string) =>
  prisma.member.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      isadmin: true,
      _count: { select: { Book: true, Mark: true } },
    },
  });

// book
export type BookAllColumn = Awaited<ReturnType<typeof findBookWithMarkById>>;
export type BookData = Omit<
  NonNullable<BookAllColumn>,
  "Mark" | "FollowBook" | "createdAt" | "updatedAt"
>;

export const findBookById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
  });

export const findBookWithMarkById = async (id: number) =>
  prisma.book.findUnique({
    where: { id },
    include: {
      FollowBook: { select: { member: true } },
      Mark: {
        include: {
          // _count: { select: { Likes: true, Report: true, Talk: true } },
          Likes: { select: { member: true } },
          Report: { select: { member: true } },
          Talk: true,
          Member: { select: { id: true, image: true, nickname: true } },
        },
      },
    },
  });

// mark
export type MarkAllColumn = NonNullable<Awaited<ReturnType<typeof findMarkWithCount>>>;
export type MarkData = Omit<MarkAllColumn, "_count" | "createdAt" | "updatedAt">;

export const findMarkWithCount = async (id: number) =>
  prisma.mark.findUnique({
    where: { id },
    include: {
      // _count: { select: { Likes: true, Talk: true, Report: true } },
      Likes: { select: { member: true } },
      Report: { select: { member: true } },
      Talk: true,
      Member: { select: { id: true, image: true, nickname: true } },
    },
  });
