"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate, validateAsync } from "@/lib/validator";
import z from "zod";

export const saveBook = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  const member = Number(session.user.id);

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
  console.log("🚀 ~ err:", err, data);
  if (err) return err;

  const id = Number(formData.get("id"));
  const { id: userId, isadmin } = session.user;

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

export const deleteBook = async (id: number) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

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

  const { id: userId, isadmin } = session.user;

  await prisma.book.delete({
    where: isadmin ? { id } : { id, member: Number(userId) },
  });
};
