import crypto from 'crypto';

/**
 * Generate Production Secrets for BRX.MA
 *
 * Usage: npm run generate-secrets
 *
 * This script generates secure random secrets for production deployment.
 * NEVER commit the generated secrets to Git!
 */

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║       BRX.MA Production Secrets Generator                 ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('🔐 Generating secure random secrets...\n');

// Generate secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const cookieSecret = crypto.randomBytes(64).toString('hex');
const dbPassword = crypto.randomBytes(32).toString('base64url');

// Display in .env format
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Copy these to your server/.env file:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('# JWT Configuration');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');

console.log('# Cookie Configuration');
console.log(`COOKIE_SECRET=${cookieSecret}`);
console.log('');

console.log('# Database Password (optional - use if creating new database)');
console.log(`DB_PASSWORD=${dbPassword}`);
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Security information
console.log('🛡️  Security Information:');
console.log('   - JWT_SECRET: 128 characters (512 bits)');
console.log('   - COOKIE_SECRET: 128 characters (512 bits)');
console.log('   - DB_PASSWORD: 43 characters (256 bits)\n');

// Important warnings
console.log('⚠️  IMPORTANT WARNINGS:');
console.log('   1. NEVER commit these secrets to Git');
console.log('   2. Store them securely (password manager, vault)');
console.log('   3. Use different secrets for dev/staging/prod');
console.log('   4. Rotate secrets every 3-6 months');
console.log('   5. If a secret is compromised, regenerate immediately\n');

// Save option
console.log('💾 Optional: Save to .env file (will append)');
console.log('   To save: npm run generate-secrets >> server/.env.production\n');

console.log('✅ Secrets generated successfully!\n');
