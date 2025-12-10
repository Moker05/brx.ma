import { StatCard, PriceDisplay, EmptyState, LoadingState } from '@/components/composite';
import { PortfolioHeader, PortfolioStats } from '@/components/portfolio';
import { ThemeToggle, ThemeSelector } from '@/components/theme';
import { useTheme } from '@/hooks/useTheme';
import { FiInbox, FiDollarSign, FiTrendingUp, FiPieChart, FiSun } from 'react-icons/fi';

/**
 * Page de démonstration des nouveaux composants
 * Route: /demo
 */
export const ComponentDemo = () => {
  const { theme, themeConfig, isDark, allThemes, setTheme } = useTheme();

  // Mock data pour la démonstration
  const mockStats = {
    availableBalance: 550000,
    totalInvested: 450000,
    totalCurrentValue: 475000,
    totalProfitLoss: 25000,
    totalProfitLossPercent: 5.56,
    totalValue: 1025000,
  };

  const mockPeriodPnL = {
    change: 15000,
    percent: 3.2,
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Démo du Système de Composants</h1>
        <p className="text-base-content/70">
          Cette page démontre tous les nouveaux composants créés pour BRX.MA
        </p>
      </div>

      {/* Section 0: Système de Thèmes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">0. Système de Thèmes</h2>

        <div className="alert alert-info">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{themeConfig.icon}</span>
              <span>
                <strong>Thème actuel:</strong> {themeConfig.displayName} - {themeConfig.description}
              </span>
            </div>
            <div className="text-sm opacity-80">
              Type: {isDark ? 'Sombre 🌙' : 'Clair ☀️'} | Nom technique: {theme}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tous les thèmes disponibles */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Thèmes disponibles</h3>
              <div className="space-y-2">
                {Object.values(allThemes).map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`btn w-full justify-start gap-3 ${
                      theme === t.name ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{t.displayName}</span>
                      <span className="text-xs opacity-70">{t.description}</span>
                    </div>
                    {theme === t.name && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Composants de thème */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Composants de thème</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm mb-2">ThemeToggle (simple):</p>
                  <ThemeToggle showLabel={true} />
                </div>

                <div className="divider"></div>

                <div>
                  <p className="text-sm mb-2">ThemeSelector (dropdown complet):</p>
                  <ThemeSelector />
                </div>

                <div className="divider"></div>

                <div>
                  <p className="text-sm text-base-content/70">
                    Le thème est sauvegardé automatiquement dans localStorage et s'applique à toute l'application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-success">
          <div className="flex items-center gap-2">
            <FiSun />
            <span>
              Essayez de changer de thème et naviguez sur les autres pages - le thème sera conservé !
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: StatCard */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. StatCard - Cartes de Statistiques</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Variant Default"
            value="1,234,567 MAD"
            subtitle="Sous-titre optionnel"
            icon={<FiDollarSign />}
          />

          <StatCard
            title="Avec Trend Positive"
            value="987,654 MAD"
            trend={{ value: 12.5, label: 'Ce mois' }}
            icon={<FiTrendingUp />}
          />

          <StatCard
            title="Avec Trend Négative"
            value="456,789 MAD"
            trend={{ value: -5.2, label: 'Cette semaine' }}
            icon={<FiPieChart />}
          />

          <StatCard
            title="Variant Gradient"
            value="2,500,000 MAD"
            subtitle="Valeur totale"
            variant="gradient"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Variant Glass"
            value="750,000 MAD"
            subtitle="Effet glassmorphism"
            variant="glass"
            trend={{ value: 8.3 }}
          />

          <StatCard
            title="Grande Carte"
            value="5,000,000 MAD"
            subtitle="Portfolio total"
            variant="gradient"
            trend={{ value: 15.7, label: 'YTD' }}
            icon={<FiDollarSign />}
          />
        </div>
      </section>

      {/* Section 2: PriceDisplay */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. PriceDisplay - Affichage de Prix</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-200 p-4">
            <h3 className="text-sm text-base-content/70 mb-2">Small Size</h3>
            <PriceDisplay
              value={900000}
              currency="MAD"
              changePercent={2.5}
              size="sm"
            />
          </div>

          <div className="card bg-base-200 p-4">
            <h3 className="text-sm text-base-content/70 mb-2">Medium Size (default)</h3>
            <PriceDisplay
              value={18000}
              currency="MAD"
              changePercent={-1.3}
              size="md"
            />
          </div>

          <div className="card bg-base-200 p-4">
            <h3 className="text-sm text-base-content/70 mb-2">Large Size</h3>
            <PriceDisplay
              value={485.5}
              currency="MAD"
              changePercent={0.49}
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200 p-4">
            <h3 className="text-sm text-base-content/70 mb-2">Sans Icône</h3>
            <PriceDisplay
              value={125000}
              currency="USD"
              changePercent={5.2}
              showIcon={false}
            />
          </div>

          <div className="card bg-base-200 p-4">
            <h3 className="text-sm text-base-content/70 mb-2">Changement Absolu</h3>
            <PriceDisplay
              value={50000}
              currency="MAD"
              change={2500}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Portfolio Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Composants Portfolio</h2>

        <div className="space-y-4">
          <PortfolioHeader
            onAddPosition={() => alert('Ajouter une position')}
            onUpdatePrices={() => alert('Mise à jour des prix')}
            onReset={() => alert('Réinitialiser')}
            isUpdatingPrices={false}
          />

          <PortfolioStats
            stats={mockStats}
            periodPnL={mockPeriodPnL}
          />
        </div>
      </section>

      {/* Section 4: States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. États (Loading & Empty)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-base">LoadingState</h3>
              <LoadingState message="Chargement des données..." size="md" />
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title text-base">EmptyState</h3>
              <EmptyState
                icon={<FiInbox />}
                title="Aucune donnée"
                description="Commencez par ajouter des éléments"
                action={
                  <button className="btn btn-primary btn-sm">
                    Ajouter
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Code Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Exemples de Code</h2>

        <div className="mockup-code">
          <pre data-prefix="1"><code>import &#123; StatCard &#125; from '@/components/composite';</code></pre>
          <pre data-prefix="2"><code></code></pre>
          <pre data-prefix="3"><code>&lt;StatCard</code></pre>
          <pre data-prefix="4"><code>  title="Solde disponible"</code></pre>
          <pre data-prefix="5"><code>  value="550,000 MAD"</code></pre>
          <pre data-prefix="6"><code>  trend=&#123;&#123; value: 2.5 &#125;&#125;</code></pre>
          <pre data-prefix="7"><code>/&gt;</code></pre>
        </div>

        <div className="mockup-code">
          <pre data-prefix="1"><code>import &#123; PriceDisplay &#125; from '@/components/composite';</code></pre>
          <pre data-prefix="2"><code></code></pre>
          <pre data-prefix="3"><code>&lt;PriceDisplay</code></pre>
          <pre data-prefix="4"><code>  value=&#123;900000&#125;</code></pre>
          <pre data-prefix="5"><code>  currency="MAD"</code></pre>
          <pre data-prefix="6"><code>  changePercent=&#123;2.5&#125;</code></pre>
          <pre data-prefix="7"><code>  size="lg"</code></pre>
          <pre data-prefix="8"><code>/&gt;</code></pre>
        </div>
      </section>

      {/* Info Box */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Page de démonstration</h3>
          <div className="text-xs">
            Cette page montre tous les composants créés. Consultez COMPONENT_SYSTEM.md pour la documentation complète.
          </div>
        </div>
      </div>
    </div>
  );
};
