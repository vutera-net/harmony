import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { generateDestinyCore } from '@/lib/domain';

export const profileRouter = router({
  createProfile: publicProcedure
    .input(z.object({
      userId: z.string(),
      birthDate: z.string(),
      birthTime: z.string().optional(),
      gender: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Tích hợp AI / Thuật toán Tính toán Bát Tự & Ngũ Hành từ tầng Domain
      const core = generateDestinyCore(input.birthDate, input.birthTime);

      return await ctx.prisma.destinyProfile.upsert({
        where: { userId: input.userId },
        update: {
          birthDate: input.birthDate,
          birthTime: input.birthTime,
          gender: input.gender,
          element: core.element,
          zodiac: core.zodiac,
        },
        create: {
          userId: input.userId,
          birthDate: input.birthDate,
          birthTime: input.birthTime,
          gender: input.gender,
          element: core.element,
          zodiac: core.zodiac,
        }
      });
    }),

  getMyProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.destinyProfile.findUnique({
        where: { userId: input.userId },
        include: { dailyInsights: true }
      });
    }),

  getDailyInsight: publicProcedure
    .input(z.object({ userId: z.string(), date: z.string() }))
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.destinyProfile.findUnique({
        where: { userId: input.userId },
        include: {
          dailyInsights: {
            where: { date: input.date },
            take: 1
          }
        }
      });
      return profile?.dailyInsights[0] || null;
    }),
});
