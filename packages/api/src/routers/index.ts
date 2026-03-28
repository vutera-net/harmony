import { router } from '../trpc';
import { authRouter } from './auth';
import { profileRouter } from './profile';
import { connectionRouter } from './connection';

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  connection: connectionRouter,
});

// Xuất Kiểu dữ liệu (Type) của toàn bộ API tree để chia sẻ với Client
export type AppRouter = typeof appRouter;
