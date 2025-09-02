import { PrismaClient } from '../lib/generated/prisma/client';

const prisma = new PrismaClient();
const mbrs = [
  {
    email: 'indiflex.corp@gmail.com',
    nickname: 'indiflex',
    image: 'https://avatars.githubusercontent.com/u/5843964?v=4',
    Book: {
      create: [
        {
          title: 'IndiFlex Personal Book',
          Mark: {
            create: {
              link: 'https://naver.com',
              title: 'Naver',
              descript: 'seeding...',
            },
          },
        },
      ],
    },
  },
  {
    email: 'indiflex.sico@gmail.com',
    nickname: '시니어코딩',
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocIXMQz3s5gQdKrno8qArpiiJ3trUHbnVM0gTw58wMDxRa-ljySL=s96-c',
  },
  {
    email: 'jeonseongho@naver.com',
    nickname: 'Jade',
    passwd: '$2b$10$zbmpxOaO4jroF9Mmrt2M8u6TWXms1/ncqJysXXOyD69aYqPaf44jG',
  },
];

async function main() {
  for (const mbr of mbrs) {
    const rs = await prisma.member.upsert({
      where: { email: mbr.email },
      update: {},
      create: { ...mbr },
    });
    console.log('🚀 ~ rs:', rs);
  }
}

main()
  .catch(async e => {
    console.error('PrismaError>>', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.error('Prisma Closed!');
  });
