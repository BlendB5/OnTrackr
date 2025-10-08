import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ontrackr.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@ontrackr.com',
      passwordHash: adminPasswordHash,
      role: 'admin'
    }
  });

  // Create employee user
  const employeePasswordHash = await bcrypt.hash('employee123', 12);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@ontrackr.com' },
    update: {},
    create: {
      name: 'John Employee',
      email: 'employee@ontrackr.com',
      passwordHash: employeePasswordHash,
      role: 'employee'
    }
  });

  console.log('Seed data created:');
  console.log('Admin:', { email: admin.email, password: 'admin123' });
  console.log('Employee:', { email: employee.email, password: 'employee123' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


