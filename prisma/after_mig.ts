import { PrismaClient } from "../lib/generated/prisma";

type COL = {
  TABLE_NAME: string;
  COLUMN_NAME: string;
};

const prisma = new PrismaClient();

async function alterUpdatedAt() {
  try {
    const columns = (await prisma.$queryRawUnsafe(`
      SELECT TABLE_NAME, COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND COLUMN_NAME = 'updatedAt'
         AND EXTRA NOT LIKE '%on update CURRENT_TIMESTAMP%'
    `)) as COL[];

    for (const col of columns) {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`${col.TABLE_NAME}\`
          MODIFY COLUMN \`updatedAt\` TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log(`✅ Updated ${col.TABLE_NAME}.updatedAt`);
    }

    if (columns.length === 0) {
      console.log("✅ All updatedAt columns already configured");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

alterUpdatedAt();
