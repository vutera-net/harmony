import { initTRPC } from '@trpc/server';
import { prisma } from '@harmony/database';

export const createContext = async () => {
  return {
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
