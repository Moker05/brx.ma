import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home/Home';
import { Markets } from './pages/Markets/Markets';
import { Crypto } from './pages/Crypto/Crypto';
import { Portfolio } from './pages/Portfolio/Portfolio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="markets" element={<Markets />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="watchlist" element={
            <div>
              <h1 className="text-3xl font-bold mb-6">Watchlist</h1>
              <div className="alert alert-info">
                <span>Page Watchlist en construction...</span>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
