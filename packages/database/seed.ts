import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ZODIAC_MAP: Record<number, string> = {
  0: 'Thân', 1: 'Dậu', 2: 'Tuất', 3: 'Hợi', 4: 'Tý', 5: 'Sửu',
  6: 'Dần', 7: 'Mão', 8: 'Thìn', 9: 'Tỵ', 10: 'Ngọ', 11: 'Mùi'
};

const ELEMENTS = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];

function getZodiac(year: number): string {
  return ZODIAC_MAP[year % 12];
}

function getElement(year: number): string {
  const heavenlyIndex = (year - 4) % 10; // Can calculation
  return ELEMENTS[Math.floor(heavenlyIndex / 2) % 5];
}

async function main() {
  console.log('🌱 Seeding fake data...');

  // Clear old data
  await prisma.dailyInsight.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.premiumReport.deleteMany();
  await prisma.harmonyScore.deleteMany();
  await prisma.destinyProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users with fake birth dates
  const sampleUsers = [
    { email: 'linh@harmony.test', name: 'Linh Nguyễn', password: 'hashed_password_1', birthDate: '1995-03-15', gender: 'Nữ' },
    { email: 'an@harmony.test', name: 'An Trần', password: 'hashed_password_2', birthDate: '1998-07-22', gender: 'Nam' },
    { email: 'hoa@harmony.test', name: 'Hoa Lê', password: 'hashed_password_3', birthDate: '2000-11-08', gender: 'Nữ' },
    { email: 'duc@harmony.test', name: 'Đức Phạm', password: 'hashed_password_4', birthDate: '1996-05-12', gender: 'Nam' },
    { email: 'mai@harmony.test', name: 'Mai Vũ', password: 'hashed_password_5', birthDate: '1999-09-30', gender: 'Nữ' },
  ];

  const users = await Promise.all(
    sampleUsers.map(u =>
      prisma.user.create({
        data: {
          email: u.email,
          name: u.name,
          passwordHash: u.password,
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);

  // Create destiny profiles
  const profiles = await Promise.all(
    users.map((user, i) => {
      const birthYear = 1995 + i;
      return prisma.destinyProfile.create({
        data: {
          userId: user.id,
          birthDate: sampleUsers[i].birthDate,
          birthTime: `${10 + i}:${Math.floor(Math.random() * 60)}`,
          gender: sampleUsers[i].gender,
          element: getElement(birthYear),
          zodiac: getZodiac(birthYear),
        },
      });
    })
  );

  console.log(`✅ Created ${profiles.length} destiny profiles`);

  // Create daily insights for today
  const today = new Date().toISOString().split('T')[0];

  const insights = [
    { energyScore: 85, doList: ['Tập trung hoàn thành dự án', 'Liên lạc người Mệnh Thủy', 'Uống cà phê vào 9h sáng'], avoidList: ['Tránh cãi vã với sếp', 'Hạn chế mặc đồ màu đỏ'], luckyColor: 'Vàng cát' },
    { energyScore: 72, doList: ['Tập yoga buổi sáng', 'Gặp gỡ người mới', 'Đi dạo công viên'], avoidList: ['Tránh quyết định tài chính lớn', 'Không nên tranh cãi'], luckyColor: 'Xanh da trời' },
    { energyScore: 92, doList: ['Khởi động dự án mới', 'Đầu tư tài chính nhỏ', 'Gọi điện cho bạn cũ'], avoidList: ['Hạn chế ăn cay nóng', 'Tránh làm việc quá giờ'], luckyColor: 'Bạc' },
    { energyScore: 68, doList: ['Thừa nhận lỗi lầm', 'Yên tĩnh suy tư', 'Chăm sóc sức khỏe'], avoidList: ['Tránh xung đột', 'Không nên đầu tư mạo hiểm'], luckyColor: 'Trắng' },
    { energyScore: 79, doList: ['Xã hội giao tiếp', 'Bắt đầu dự án sáng tạo', 'Đi mua sắm'], avoidList: ['Tránh lãng phí tiền bạc', 'Không uống rượu quá nhiều'], luckyColor: 'Tím' },
  ];

  await Promise.all(
    profiles.map((profile, i) =>
      prisma.dailyInsight.create({
        data: {
          profileId: profile.id,
          date: today,
          energyScore: insights[i].energyScore,
          doList: insights[i].doList,
          avoidList: insights[i].avoidList,
          luckyColor: insights[i].luckyColor,
        },
      })
    )
  );

  console.log(`✅ Created ${profiles.length} daily insights`);

  // Create connections (random pairs)
  const connections = [
    { userId: users[0].id, friendUserId: users[1].id },
    { userId: users[0].id, friendUserId: users[2].id },
    { userId: users[1].id, friendUserId: users[3].id },
    { userId: users[2].id, friendUserId: users[4].id },
  ];

  await Promise.all(
    connections.map(conn =>
      prisma.connection.create({
        data: {
          userId: conn.userId,
          friendUserId: conn.friendUserId,
          status: 'accepted',
          compatibilityScore: Math.floor(Math.random() * 100),
        },
      })
    )
  );

  console.log(`✅ Created ${connections.length} connections`);

  // Create harmony scores
  await Promise.all(
    users.map(user =>
      prisma.harmonyScore.create({
        data: {
          userId: user.id,
          score: Math.floor(Math.random() * 100),
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} harmony scores`);

  console.log('\n🎉 Seeding complete!\n');
  console.log('Demo credentials:');
  sampleUsers.forEach(u => {
    console.log(`  - ${u.email} / password (plain, needs to be set)`);
  });
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
