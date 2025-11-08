"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";
import { revalidateTag, unstable_cache } from "next/cache";
import z from "zod";

export const getAllBooksByMember = async (member: number) =>
  unstable_cache(
    () => {
      console.log("******* getAllBooksByMember>>", member);
      return prisma.book.findMany({
        where: { member },
        include: {
          FollowBook: { select: { member: true } },
          Mark: {
            include: {
              Likes: { select: { member: true } },
              Report: { select: { member: true } },
              Talk: true,
              Member: { select: { id: true, image: true, nickname: true } },
            },
          },
        },
      });
    },
    [`member-books-${member}`], // ! cache-key
    { tags: [`member-books-${member}`] }, // options
  )();

export const saveBook = async (formData: FormData) => {
  const user = await checkLogin();

  const member = Number(user.id);

  console.log("🚀 ~ formData:", Object.fromEntries(formData.entries()));

  const zobj = z
    .object({
      title: z.string().min(1),
      ispublic: z.string().optional(),
      withdel: z.string().optional(),
      remark: z.string().optional(),
    })
    .refine(({ ispublic, withdel }) => !ispublic || (ispublic && !withdel), {
      path: ["withdel"],
      message: "Public book cannot have open with deletion!",
    });

  const [err, data] = validate(zobj, formData);
  // console.log('🚀 ~ err:', err, data);
  if (err) return err;

  const id = Number(formData.get("id"));
  const { id: userId, isadmin } = user;

  if (id) {
    await prisma.book.update({
      where: isadmin ? { id } : { id, member: Number(userId) },
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
      },
    });
  } else {
    await prisma.book.create({
      data: {
        ...data,
        ispublic: data.ispublic === "on",
        withdel: !!data.withdel,
        member,
      },
    });
  }
};

export const saveMark = async (formData: FormData) => {
  const { id: userId, isadmin } = await checkLogin();
  const maker = Number(userId); // book의 주인이 아니어도 추가가능
  console.log("🚀 ~ formData:", Object.fromEntries(formData.entries()));

  // check book owner & if book is present
  const bookId = Number(formData.get("book"));
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });
  // if(!book) return {bookP:{errors:[]}} // 여기서 리턴하면 안됨! : 왜냐면  아래 value를 전달할수가 없음

  const zobj = z
    .object({
      link: z.string().min(1).max(1024),
      title: z.string().min(1).max(120),
      image: z.string().optional(),
      descript: z.string().optional(),
    })
    .refine(() => !!book, {
      path: ["book"],
      message: "This book is not exists!",
    });

  const [err, data] = validate(zobj, formData);
  // console.log('🚀 ~ err:', err, data);
  // * `!book?.id` is for TS
  if (err && !book?.id) return err;

  const id = Number(formData.get("id"));
  const isBookOwner = book.member === maker;

  if (id) {
    await prisma.mark.update({
      where: isadmin || isBookOwner ? { id } : { id, maker },
      data,
    });
  } else {
    await prisma.mark.create({
      data: {
        ...data,
        book: book.id,
        maker,
      },
    });
  }
  revalidateTag(`member-books-${maker}`);
};

const checkLogin = async () => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");
  return session.user;
};

export const deleteBook = async (id: number) => {
  // const session = await auth();
  // if (!session?.user || !session.user.id) throw new Error('Need Login');
  const user = await checkLogin();

  const zobj = z
    .object({
      id: z.number(),
    })
    .superRefine(async ({ id }, ctx) => {
      const book = await prisma.book.findUnique({
        where: { id },
        // where: { id: id + 10000 },
      });

      if (!book) {
        ctx.addIssue({
          code: "custom",
          message: `This Book(#${id}) is not exists!`,
          path: ["id"],
        });
      }
    });

  const [err] = await validateAsync(zobj, { id });
  if (err) return err;

  const { id: userId, isadmin } = user;

  await prisma.book.delete({
    where: isadmin ? { id } : { id, member: Number(userId) },
  });
};

export const likesAndReports = async (member: number) => {
  const ilikes = await prisma.likes.findMany({
    where: { member },
    select: { mark: true },
  });

  const ireports = await prisma.report.findMany({
    where: { member },
    select: { mark: true },
  });

  return [ilikes, ireports];
};

export const deleteMarkWithBookId = async (markId: number, bookId: number) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });
  if (!book) throw new Error(`This Book(#${bookId}) is not exists!`);

  return deleteMark(markId, book.member);
};
export const deleteMark = async (id: number, bookOwner: number) => {
  const { id: userId, isadmin } = await checkLogin();
  console.log("🚀 ~ userId:", userId, id, bookOwner);

  // check exists
  const mark = await prisma.mark.findUnique({
    where: { id },
  });
  if (!mark) throw new Error(`This Mark(#${id}) is not exists!`);

  const bookOnwerId = bookOwner || (await prisma.book);

  if (!isadmin && Number(userId) !== bookOwner && mark.maker !== Number(userId))
    throw new Error(`You have not authentication!`);

  await prisma.mark.delete({
    where: { id },
  });
  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleLikesOrReportMark = async (
  mark: number,
  type: "likes" | "reports",
  bookOwner: number,
) => {
  const { id: userId } = await checkLogin();
  const member = Number(userId);

  const data = { mark, member };
  const where = { where: data };
  const whereMarkMember = { where: { mark_member: data } };

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // if (mark === 4) throw new Error("XXXXXXXXXX");

  // select count(*) from Likes where mark = mark and member=userId
  const likesCnt = await (type === "likes"
    ? prisma.likes.count(where)
    : prisma.report.count(where));

  if (likesCnt > 0) {
    type === "likes"
      ? await prisma.likes.delete(whereMarkMember)
      : await prisma.report.delete(whereMarkMember);
  } else {
    type === "likes"
      ? await prisma.likes.create({ data })
      : await prisma.report.create({ data });
  }

  console.log("🚀 expire tag:", `member-books-${bookOwner}`);
  revalidateTag(`member-books-${bookOwner}`);
};

export const toggleFollowBook = async (book: number, bookOwner: number) => {
  const { id } = await checkLogin();
  const member = Number(id);
  const fb = await prisma.followBook.findUnique({
    where: { book_member: { book, member } },
  });

  if (fb)
    await prisma.followBook.delete({
      where: { book_member: { book, member } },
    });
  else
    await prisma.followBook.create({
      data: { book, member },
    });

  revalidateTag(`member-books-${bookOwner}`);
  // revalidatePath(`/bookcase/${bookOwner}`);
};
