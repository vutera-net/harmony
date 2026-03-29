import { initTRPC, TRPCError } from '@trpc/server';
import { prisma } from '@harmony/database';
import superjson from 'superjson';
import { getServerSession } from "next-auth";
import { authOptions } from "@harmony/auth";

export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return {
    prisma,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
