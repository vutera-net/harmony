import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { calculateCompatibility } from '@harmony/domain';

export const connectionRouter = router({
  
  // 1. Tìm người dùng bằng Email
  searchUser: protectedProcedure
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
  addConnection: protectedProcedure
    .input(z.object({
      friendUserId: z.string(),    // ID người được kết nối
    }))
    .mutation(async ({ input, ctx }) => {
      const myId = ctx.session.user.id;
      // Vì là Auto-Accept MVP, tạo 1 record accepted luôn
      return await ctx.prisma.connection.create({
        data: {
          userId: myId,
          friendUserId: input.friendUserId,
          status: "accepted"
        }
      });
    }),

  // 3. Hiển thị danh sách Bạn Bè kèm điểm Chấm Tương Hợp
  listConnections: protectedProcedure
    .query(async ({ ctx }) => {
      const myId = ctx.session.user.id;
      
      // Lấy Profile của TÔI
      const myProfile = await ctx.prisma.destinyProfile.findUnique({
        where: { userId: myId }
      });

      // Lấy danh sách kết nối
      const connections = await ctx.prisma.connection.findMany({
        where: { 
          OR: [
            { userId: myId },
            { friendUserId: myId }
          ],
          status: "accepted"
        },
        include: {
          user: { include: { destinyProfile: true } },
          friendUser: { include: { destinyProfile: true } }
        }
      });

      // Map về dữ liệu Friend + Tính điểm tương hợp Realtime
      return connections.map((conn) => {
        const isRequester = conn.userId === myId;
        const friend = isRequester ? conn.friendUser : conn.user;
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
