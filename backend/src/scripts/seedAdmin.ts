import prisma from '../config/db';
import { hashPassword } from '../utils/hash';
import { Role } from '@prisma/client';

export const seedAdmin = async () => {
  const adminEmail = 'audreykirezi@gmail.com';
  const adminPassword = 'Password!23';

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmail, role: Role.ADMIN },
    });

    if (existingAdmin) {
      console.log('🚨 Admin already exists');
      return;
    }

    const hashed = await hashPassword(adminPassword);

    const admin = await prisma.user.create({
      data: {
        name: 'Audrey',
        email: adminEmail,
        password: hashed,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Default admin created:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    console.error('❌ Failed to seed admin:', err);
  }
};
