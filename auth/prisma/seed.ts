import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding...");

  // Clean existing users to avoid conflicts
  await prisma.user.deleteMany({});

  const passwords = await Promise.all([
    bcrypt.hash("password123", 10),
    bcrypt.hash("password456", 10),
  ]);

  const users = [
    {
      name: "User Verified",
      email: "verified@example.com",
      emailVerified: new Date(),
      password: passwords[0],
    },
    {
      name: "User Unverified",
      email: "unverified@example.com",
      emailVerified: null,
      password: passwords[1],
    },
    {
      name: "OAuth User",
      email: "oauth@example.com",
      emailVerified: new Date(),
      password: null, // No password for OAuth users
    },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: u,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
