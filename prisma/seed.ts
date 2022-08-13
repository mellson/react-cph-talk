/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const numberOfUsersWeWant = 100;
  const numberOfExistingUsers = await prisma.user.count();

  // Create fake users so we always have 100 users
  Array.from(Array(numberOfUsersWeWant - numberOfExistingUsers).keys()).forEach(
    async () => {
      await prisma.user.create({
        data: {
          name: faker.name.fullName(),
          avatar: faker.internet.avatar(),
        },
      });
    },
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
