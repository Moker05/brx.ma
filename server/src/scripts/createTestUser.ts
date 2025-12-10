import { registerUser } from '../services/auth.service';
import { prisma } from '../utils/prisma';

async function createTestUser() {
  const testEmail = 'test@brx.ma';
  const testPassword = 'Test123456!';
  const testName = 'Test User';

  try {
    // Delete existing test user if present
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});

    const user = await registerUser(testEmail, testPassword, testName);

    // Mark email as verified
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('👤 Name:', testName);
    console.log('✉️  Email verified: Yes');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
