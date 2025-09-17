import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();
const mbrs = [
  {
    email: "love.and.seul@gmail.com",
    nickname: "love.and.seul",
    image: "https://avatars.githubusercontent.com/u/140625136?v=4",
    Book: {
      create: [
        {
          title: "seulwithlove's Book",
          Mark: {
            create: {
              link: "https://github.com",
              title: "Github",
              descript: "seeding...",
            },
          },
        },
      ],
    },
  },
  {
    email: "rosily313@gmail.com",
    nickname: "이코키",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJWi4cfOFoNNkNIfPtRUx7tVDH2QfyEi6hc5yRHF77WLMlhu5j4=s576-c-no",
  },
  {
    email: "anfrhrl0313@naver.com",
    nickname: "Seul",
    passwd: "0P0rSPp5tX",
  },
];

async function main() {
  for (const mbr of mbrs) {
    const rs = await prisma.member.upsert({
      where: { email: mbr.email },
      update: {},
      create: { ...mbr },
    });
    console.log("🚀 ~ rs:", rs);
  }
}

main()
  .catch(async (e) => {
    console.error("PrismaError>>", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.error("Prisma Closed!");
  });
