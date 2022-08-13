/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  Array.from(Array(100).keys()).forEach(async (index) => {
    const id = `${index + 1}`;
    await prisma.user.upsert({
      where: {
        id,
      },
      create: {
        id,
        name: faker.name.fullName(),
        avatar: faker.internet.avatar(),
      },
      update: {},
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
