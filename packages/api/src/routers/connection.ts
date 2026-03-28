import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { calculateCompatibility } from '@harmony/domain';

export const connectionRouter = router({
  
  // 1. Tìm người dùng bằng Email
  searchUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        include: { destinyProfile: true }
      });
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        hasProfile: !!user.destinyProfile
      };
    }),

  // 2. Tự động Kết Buộc 2 Sinh Mệnh (MVP Auto-Accept)
  addConnection: publicProcedure
    .input(z.object({
      requesterId: z.string(), // ID gốc
      targetId: z.string(),    // Bạn bè
    }))
    .mutation(async ({ input, ctx }) => {
      // Vì là Auto-Accept MVP, tạo 1 record accepted luôn
      return await ctx.prisma.connection.create({
        data: {
          requesterId: input.requesterId,
          targetId: input.targetId,
          status: "accepted"
        }
      });
    }),

  // 3. Hiển thị danh sách Bạn Bè kèm điểm Chấm Tương Hợp
  listConnections: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      
      // Lấy Profile của TÔI
      const myProfile = await ctx.prisma.destinyProfile.findUnique({
        where: { userId: input.userId }
      });

      // Lấy danh sách kết nối
      const connections = await ctx.prisma.connection.findMany({
        where: { 
          OR: [
            { requesterId: input.userId },
            { targetId: input.userId }
          ],
          status: "accepted"
        },
        include: {
          requester: { include: { destinyProfile: true } },
          target: { include: { destinyProfile: true } }
        }
      });

      // Map về dữ liệu Friend + Tính điểm tương hợp Realtime
      return connections.map((conn: any) => {
        const isRequester = conn.requesterId === input.userId;
        const friend = isRequester ? conn.target : conn.requester;
        const friendProfile = friend.destinyProfile;

        // Nếu cả 2 đều có Profile, Tính điểm!
        let compatibility = null;
        if (myProfile && friendProfile && myProfile.element && friendProfile.element) {
          compatibility = calculateCompatibility(myProfile.element, friendProfile.element);
        }

        return {
          connectionId: conn.id,
          friendInfo: {
            id: friend.id,
            name: friend.name || friend.email,
            email: friend.email,
            element: friendProfile?.element || "Chưa Khám Phá",
            zodiac: friendProfile?.zodiac || "?"
          },
          compatibility
        };
      });
    }),
});
