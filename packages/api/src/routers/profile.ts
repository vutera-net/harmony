import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { generateDestinyCore } from '@harmony/domain';

export const profileRouter = router({
  createProfile: protectedProcedure
    .input(z.object({
      birthDate: z.string(),
      birthTime: z.string().optional(),
      gender: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Tích hợp AI / Thuật toán Tính toán Bát Tự & Ngũ Hành từ tầng Domain
      const core = generateDestinyCore(input.birthDate, input.birthTime);

      return await ctx.prisma.destinyProfile.create({
        data: {
          userId: ctx.session.user.id,
          birthDate: input.birthDate,
          birthTime: input.birthTime,
          gender: input.gender,
          element: core.element,
          zodiac: core.zodiac,
        }
      });
    }),

  getMyProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.destinyProfile.findUnique({
        where: { userId: ctx.session.user.id },
        include: { dailyInsights: true }
      });
    })
});
