/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { t } from '../trpc';
import { waitAndMaybeThrowError } from '../utils';

/**
 * Default selector for User.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  avatar: true,
  isFriend: true,
  isBestFriend: true,
});

export const userRouter = t.router({
  all: t.procedure.query(() =>
    prisma.user.findMany({
      select: defaultUserSelect,
    }),
  ),
  search: t.procedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(({ input }) => {
      const { query } = input;
      return prisma.user.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: defaultUserSelect,
      });
    }),
  setFriend: t.procedure
    .input(z.object({ userId: z.string(), isFriend: z.boolean() }))
    .mutation(async ({ input }) => {
      const { userId, isFriend } = input;
      await waitAndMaybeThrowError();
      return prisma.user.update({
        data: { isFriend },
        where: { id: userId },
      });
    }),
  setBestFriend: t.procedure
    .input(z.object({ userId: z.string(), isBestFriend: z.boolean() }))
    .mutation(async ({ input }) => {
      const { userId, isBestFriend } = input;
      await waitAndMaybeThrowError();
      return prisma.user.update({
        data: { isBestFriend },
        where: { id: userId },
      });
    }),
});
