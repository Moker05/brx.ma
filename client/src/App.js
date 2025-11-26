import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="logo">
            <h1>BRX<span>.MA</span></h1>
            <p className="tagline">Bourse de Casablanca en temps réel</p>
          </div>
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <section className="hero">
            <h2>Bienvenue sur BRX.MA</h2>
            <p>
              Suivez et analysez les actions de la Bourse de Casablanca avec des graphiques 
              interactifs et des données en temps réel.
            </p>
          </section>

          <section className="features">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Graphiques Avancés</h3>
              <p>Visualisez les tendances avec des graphiques professionnels</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Données en Temps Réel</h3>
              <p>Suivez l'évolution des prix en direct</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Analyse Technique</h3>
              <p>Indicateurs et outils d'analyse intégrés</p>
            </div>
          </section>

          <section className="status">
            <div className="status-card">
              <h4>État du système</h4>
              <div className="status-indicator">
                <span className="status-dot active"></span>
                <span>Phase 1 - Configuration terminée ✓</span>
              </div>
              <p className="status-info">
                Le projet est en cours de développement. Les fonctionnalités seront 
                ajoutées progressivement au cours des prochaines phases.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="App-footer">
        <div className="container">
          <p>&copy; 2024 BRX.MA - Tous droits réservés</p>
          <p className="footer-note">Développé avec ❤️ pour la communauté des investisseurs marocains</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
