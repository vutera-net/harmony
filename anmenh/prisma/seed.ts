import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Đang dọn dẹp hệ thống cũ...");
  await prisma.connection.deleteMany({});
  await prisma.dailyInsight.deleteMany({});
  await prisma.destinyProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Bắt đầu gieo hạt (Seeding) Fake Data...");

  // 1. Tạo User "Tôi" (Mock Session ID)
  const myUser = await prisma.user.create({
    data: {
      id: "user-id-mock-for-demo",
      email: "toi@harmony.com",
      passwordHash: "123456",
      destinyProfile: {
        create: {
          birthDate: "1998-05-15",
          gender: "Nam",
          element: "Thủy",
          zodiac: "Dần",
        }
      }
    },
    include: { destinyProfile: true }
  });

  const today = new Date().toISOString().split('T')[0];
  if (myUser.destinyProfile) {
    await prisma.dailyInsight.create({
      data: {
        profileId: myUser.destinyProfile.id,
        date: today,
        energyScore: 88,
        doList: JSON.stringify(["Tập trung hoàn thành dự án đang dở dang.", "Uống một ly cà phê vào 9h sáng."]),
        avoidList: JSON.stringify(["Tuyệt đối tránh các cuộc cãi vã vô bổ.", "Hạn chế mặc đồ màu đỏ máu hoặc cam chói."]),
        luckyColor: "Vàng cát",
      }
    });
  }

  // 2. Tạo User Mới (Hợp với Tôi) - Mộc
  const friend1 = await prisma.user.create({
    data: {
      email: "banhop@harmony.com",
      passwordHash: "123",
      destinyProfile: {
        create: { birthDate: "1996-01-01", gender: "Nữ", element: "Mộc", zodiac: "Tý" }
      }
    }
  });

  // 3. Tạo User Khắc (Khắc với Tôi) - Hỏa
  const friend2 = await prisma.user.create({
    data: {
      email: "bankhac@harmony.com",
      passwordHash: "123",
      destinyProfile: {
        create: { birthDate: "2000-01-01", gender: "Nam", element: "Hỏa", zodiac: "Thìn" }
      }
    }
  });

  // 4. Tạo Connection sẵn
  await prisma.connection.create({
    data: {
      userId: myUser.id,
      friendUserId: friend1.id,
      status: "accepted"
    }
  });

  await prisma.connection.create({
    data: {
      userId: myUser.id,
      friendUserId: friend2.id,
      status: "accepted"
    }
  });

  console.log("✅ Seed thành công! Dữ liệu đã sẵn sàng.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
