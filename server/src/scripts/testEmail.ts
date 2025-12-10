import 'dotenv/config';
import { sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail, verifyEmailConnection } from '../utils/email.util';

/**
 * Test Email Script
 * Usage: npm run test-email <test-email@example.com>
 */
async function main() {
  console.log('\n=== BRX.MA Email Testing Tool ===\n');

  // Get email from command line args
  const testEmail = process.argv[2];

  if (!testEmail || !testEmail.includes('@')) {
    console.error('❌ Please provide a valid email address');
    console.log('\nUsage: npm run test-email <test-email@example.com>');
    console.log('Example: npm run test-email john.doe@gmail.com');
    process.exit(1);
  }

  console.log(`📧 Test email will be sent to: ${testEmail}\n`);

  // Step 1: Verify SMTP connection
  console.log('Step 1: Verifying SMTP connection...');
  const isConnected = await verifyEmailConnection();

  if (!isConnected) {
    console.error('\n❌ SMTP connection failed!');
    console.log('\n📋 Setup Instructions:\n');
    console.log('1. Update server/.env with SMTP credentials:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASSWORD=your-app-password');
    console.log('\n2. For Gmail users:');
    console.log('   - Enable 2FA: https://myaccount.google.com/security');
    console.log('   - Create App Password: https://myaccount.google.com/apppasswords');
    console.log('   - Use the generated password (16 chars) as SMTP_PASSWORD');
    console.log('\n3. Alternative SMTP providers:');
    console.log('   - SendGrid: https://sendgrid.com (100 emails/day free)');
    console.log('   - Mailgun: https://mailgun.com (5,000 emails/month free)');
    console.log('   - Amazon SES: https://aws.amazon.com/ses/');
    process.exit(1);
  }

  console.log('✅ SMTP connection verified!\n');

  // Step 2: Send test emails
  try {
    console.log('Step 2: Sending test emails...\n');

    // Test 1: Verification Email
    console.log('📧 Test 1/3: Sending verification email...');
    const mockVerificationToken = 'mock-token-' + Date.now();
    await sendVerificationEmail(testEmail, mockVerificationToken);
    console.log('✅ Verification email sent\n');

    // Wait 2 seconds between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Password Reset Email
    console.log('📧 Test 2/3: Sending password reset email...');
    const mockResetToken = 'mock-reset-' + Date.now();
    await sendResetPasswordEmail(testEmail, mockResetToken);
    console.log('✅ Password reset email sent\n');

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Welcome Email
    console.log('📧 Test 3/3: Sending welcome email...');
    await sendWelcomeEmail(testEmail, 'Test User');
    console.log('✅ Welcome email sent\n');

    console.log('🎉 All test emails sent successfully!');
    console.log(`\n📬 Check inbox for: ${testEmail}`);
    console.log('   (Check spam folder if emails not found)\n');

  } catch (error: any) {
    console.error('\n❌ Error sending test emails:', error.message);
    console.error('\nPossible issues:');
    console.error('  - Invalid SMTP credentials');
    console.error('  - SMTP server blocking connection');
    console.error('  - Daily email limit reached');
    console.error('  - Recipient email invalid');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
