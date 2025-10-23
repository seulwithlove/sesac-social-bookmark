"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { validate } from "@/lib/validator";
import z from "zod";

export const saveBook = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.id) throw new Error("Need Login");

  const member = Number(session.user.id);

  const zobj = z
    .object({
      title: z.string().min(1),
      ispublic: z.string().optional(),
      withdel: z.string().optional(),
      remark: z.string().optional(),
    })
    .refine(({ ispublic, withdel }) => !ispublic || (ispublic && !withdel), {
      path: ["withdel"],
      message: "Public book cannot have opening with deletion",
    });

  const [err, data] = validate(zobj, formData);
  console.log("💻 - book.action.ts - err, data:", err, data);

  if (err) return err;

  const id = Number(formData.get("id"));
  if (id) {
    await prisma.book.update({
      where: { id },
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

  // QQQ: check exists

  prisma.book.delete({
    where: { id },
  });
};
