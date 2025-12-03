import { PrismaClient, AssetType, Market, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@brx.ma' },
    update: {},
    create: {
      id: 'demo-user-001',
      email: 'demo@brx.ma',
      password: 'hashed_password_placeholder',
      name: 'Utilisateur Démo',
    },
  });

  console.log('✅ User created:', user.email);

  // Prix BTC au 01/12/2025 (simulé)
  const btcPriceAtPurchase = 900000; // 900,000 MAD pour 1 BTC
  const btcQuantity = 0.5;
  const btcTotalInvested = btcQuantity * btcPriceAtPurchase; // 450,000 MAD
  const initialBalance = 550000; // Solde restant après achat

  // Create virtual wallet with BTC position
  const wallet = await prisma.virtualWallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balance: initialBalance,
      currency: 'MAD',
      positions: {
        create: {
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
      },
      transactions: {
        create: {
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
      },
    },
  });

  console.log('✅ Wallet created with balance:', wallet.balance, 'MAD');

  // Create initial portfolio snapshot
  const snapshot = await prisma.portfolioSnapshot.create({
    data: {
      walletId: wallet.id,
      totalValue: wallet.balance + btcTotalInvested,
      availableBalance: wallet.balance,
      investedValue: btcTotalInvested,
      profitLoss: 0,
      profitLossPercent: 0,
      timestamp: new Date('2025-12-01T00:00:00Z'),
    },
  });

  console.log('✅ Initial snapshot created:', snapshot.id);

  console.log('');
  console.log('📊 Résumé du portefeuille:');
  console.log('   Solde disponible:', wallet.balance.toLocaleString(), 'MAD');
  console.log('   Position BTC: 0.5 BTC @', btcPriceAtPurchase.toLocaleString(), 'MAD');
  console.log('   Investi:', btcTotalInvested.toLocaleString(), 'MAD');
  console.log('   Valeur totale:', (wallet.balance + btcTotalInvested).toLocaleString(), 'MAD');
  console.log('');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
