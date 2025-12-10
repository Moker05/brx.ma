import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home/Home';
import { Markets } from './pages/Markets/Markets';
import { Crypto } from './pages/Crypto/Crypto';
import { Portfolio } from './pages/Portfolio/Portfolio';
import { VirtualTrading } from './pages/Portfolio/VirtualTrading';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PersonalDashboard } from './pages/Dashboard/PersonalDashboard';
import { CommunityFeed } from './pages/Social/CommunityFeed';
import { ComponentDemo } from './pages/ComponentDemo';
import { StockDiscussion } from './pages/Social/StockDiscussion';
import { UserProfile } from './pages/Social/UserProfile';
import { Leaderboard } from './pages/Social/Leaderboard';
import { MyProfile } from './pages/Social/MyProfile';
import { StockDetail } from './pages/StockDetail';
import { useThemeStore } from './stores/themeStore';
import { OPCVM, OPCVMDetail } from './pages/OPCVM';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

function App() {
  // Initialize theme on app mount
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute('data-theme', currentTheme);
    const isDark = currentTheme !== 'brx-light';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [currentTheme]);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="markets" element={<Markets />} />
              <Route path="crypto" element={<Crypto />} />
              <Route path="trading" element={<VirtualTrading />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="demo" element={<ComponentDemo />} />
              <Route path="opcvm" element={<OPCVM />} />
              <Route path="opcvm/:id" element={<OPCVMDetail />} />
              <Route path="watchlist" element={
                <div>
                  <h1 className="text-3xl font-bold mb-6">Watchlist</h1>
                  <div className="alert alert-info">
                    <span>Page Watchlist en construction...</span>
                  </div>
                </div>
              } />
                <Route path="community" element={<CommunityFeed />} />
                <Route path="stock/:ticker/discussion" element={<StockDiscussion />} />
                <Route path="stocks/:ticker" element={<StockDetail />} />
                <Route path="users/:userId" element={<UserProfile />} />
                <Route path="leaderboard" element={<Leaderboard />} />
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<PersonalDashboard />} />
                  <Route path="my-profile" element={<MyProfile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
