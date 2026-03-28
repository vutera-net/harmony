import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Gọi lên Adapter Auth hoặc DB
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      return { token: "generated-jwt-token", userId: user.id };
    }),
  
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          passwordHash: input.password, // Thường sẽ hash trước khi lưu
        }
      });
      return { success: true, userId: user.id };
    })
});
