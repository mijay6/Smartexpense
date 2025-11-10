import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const adminData = {
      email: 'admin@gmail.com',
      password: 'Admin123!', 
      firstName: 'Mihai',
      lastName: 'Dobra',
      role: 'ADMIN',
      country: 'RO',
      currency: 'EUR'
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
        country: adminData.country,
        currency: adminData.currency
      }
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
