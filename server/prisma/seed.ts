import bcrypt from 'bcryptjs';
import { PrismaClient, AssetType, Market, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Password for all test users
  const password = 'Password123!';
  const saltRounds = 12;
  const hashed = await bcrypt.hash(password, saltRounds);

  // ============================================
  // 1. Create test users
  // ============================================

  // Main test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@brx.ma' },
    update: { password: hashed, name: 'Test User', emailVerified: true },
    create: {
      email: 'test@brx.ma',
      password: hashed,
      name: 'Test User',
      emailVerified: true,
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Demo user with portfolio
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@brx.ma' },
    update: { password: hashed, name: 'Utilisateur Démo', emailVerified: true },
    create: {
      email: 'demo@brx.ma',
      password: hashed,
      name: 'Utilisateur Démo',
      emailVerified: true,
    },
  });
  console.log('✅ Demo user created:', demoUser.email);

  // ============================================
  // 2. Create virtual wallets
  // ============================================

  // Test user wallet
  const testWallet = await prisma.virtualWallet.upsert({
    where: { userId: testUser.id },
    update: { balance: 100000, currency: 'MAD' },
    create: {
      userId: testUser.id,
      balance: 100000,
      currency: 'MAD',
    },
  });
  console.log('✅ Test wallet created with balance:', testWallet.balance, 'MAD');

  // Demo user wallet with BTC position
  const btcPriceAtPurchase = 900000; // 900,000 MAD pour 1 BTC
  const btcQuantity = 0.5;
  const btcTotalInvested = btcQuantity * btcPriceAtPurchase; // 450,000 MAD
  const initialBalance = 550000; // Solde restant après achat

  const demoWallet = await prisma.virtualWallet.upsert({
    where: { userId: demoUser.id },
    update: { balance: initialBalance, currency: 'MAD' },
    create: {
      userId: demoUser.id,
      balance: initialBalance,
      currency: 'MAD',
    },
  });
  console.log('✅ Demo wallet created with balance:', demoWallet.balance, 'MAD');

  // ============================================
  // 3. Create demo BTC position
  // ============================================

  const btcPosition = await prisma.position.upsert({
    where: {
      walletId_symbol_assetType: {
        walletId: demoWallet.id,
        symbol: 'BTC',
        assetType: AssetType.CRYPTO,
      },
    },
    update: {},
    create: {
      walletId: demoWallet.id,
      symbol: 'BTC',
      assetType: AssetType.CRYPTO,
      market: Market.CRYPTO,
      quantity: btcQuantity,
      avgPurchasePrice: btcPriceAtPurchase,
      totalInvested: btcTotalInvested,
      currentPrice: btcPriceAtPurchase,
      currentValue: btcTotalInvested,
      purchaseDate: new Date('2025-12-01T00:00:00Z'),
      name: 'Bitcoin',
      notes: 'Position initiale de démonstration',
    },
  });
  console.log('✅ BTC position created:', btcPosition.symbol, btcPosition.quantity);

  // ============================================
  // 4. Create BTC transaction
  // ============================================

  await prisma.transaction.create({
    data: {
      walletId: demoWallet.id,
      type: TransactionType.BUY,
      symbol: 'BTC',
      assetType: AssetType.CRYPTO,
      market: Market.CRYPTO,
      quantity: btcQuantity,
      price: btcPriceAtPurchase,
      totalAmount: btcTotalInvested,
      fee: btcTotalInvested * 0.005, // 0.5% frais
      purchaseDate: new Date('2025-12-01T00:00:00Z'),
      notes: 'Achat initial de 0.5 BTC',
    },
  });
  console.log('✅ BTC transaction created');

  // ============================================
  // 5. Create portfolio snapshot
  // ============================================

  await prisma.portfolioSnapshot.create({
    data: {
      walletId: demoWallet.id,
      totalValue: demoWallet.balance + btcTotalInvested,
      availableBalance: demoWallet.balance,
      investedValue: btcTotalInvested,
      profitLoss: 0,
      profitLossPercent: 0,
      timestamp: new Date('2025-12-01T00:00:00Z'),
    },
  });
  console.log('✅ Initial snapshot created');

  // ============================================
  // 6. Create portfolios
  // ============================================

  const testPortfolio = await prisma.portfolio.upsert({
    where: { id: testUser.id },
    update: {},
    create: {
      id: testUser.id,
      userId: testUser.id,
      name: 'Main Portfolio',
      description: 'Portfolio principal',
    },
  });
  console.log('✅ Test portfolio created:', testPortfolio.name);

  const demoPortfolio = await prisma.portfolio.upsert({
    where: { id: demoUser.id },
    update: {},
    create: {
      id: demoUser.id,
      userId: demoUser.id,
      name: 'Demo Portfolio',
      description: 'Portfolio de démonstration',
    },
  });
  console.log('✅ Demo portfolio created:', demoPortfolio.name);

  // ============================================
  // Summary
  // ============================================

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('👤 Test User:');
  console.log('   Email: test@brx.ma');
  console.log('   Password: Password123!');
  console.log('   Wallet: 100,000 MAD');
  console.log('');
  console.log('👤 Demo User:');
  console.log('   Email: demo@brx.ma');
  console.log('   Password: Password123!');
  console.log('   Wallet: 550,000 MAD');
  console.log('   Position: 0.5 BTC @ 900,000 MAD (450,000 MAD invested)');
  console.log('   Total Value: 1,000,000 MAD');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
