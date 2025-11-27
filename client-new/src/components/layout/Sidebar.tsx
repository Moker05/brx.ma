import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiStar,
  FiX
} from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Accueil' },
    { path: '/markets', icon: FiTrendingUp, label: 'Marchés' },
    { path: '/crypto', icon: SiBitcoin, label: 'Crypto' },
    { path: '/portfolio', icon: FiBriefcase, label: 'Portfolio' },
    { path: '/watchlist', icon: FiStar, label: 'Watchlist' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-base-200 w-64 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <ul className="menu p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-300'
                    }
                  `}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Market Summary */}
        <div className="p-4 mt-4 border-t border-base-300">
          <h3 className="text-sm font-semibold mb-3 text-base-content/70">
            Indices
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">MASI</span>
              <span className="text-sm font-semibold text-success">
                +0.35%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">MADEX</span>
              <span className="text-sm font-semibold text-success">
                +0.31%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">BTC/USD</span>
              <span className="text-sm font-semibold text-error">
                -1.24%
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
