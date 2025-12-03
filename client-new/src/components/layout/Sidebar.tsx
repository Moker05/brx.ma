import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiTrendingUp,
  FiBriefcase,
  FiStar,
  FiX,
  FiActivity,
  FiLayers,
} from 'react-icons/fi';
import { FiMessageSquare, FiAward, FiUser } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Accueil' },
    { path: '/markets', icon: FiTrendingUp, label: 'Marches' },
    { path: '/crypto', icon: SiBitcoin, label: 'Crypto' },
    { path: '/trading', icon: FiActivity, label: 'Trading virtuel' },
    { path: '/portfolio', icon: FiBriefcase, label: 'Portfolio' },
    { path: '/opcvm', icon: FiLayers, label: 'OPCVM' },
    { path: '/watchlist', icon: FiStar, label: 'Watchlist' },
    { path: '/community', icon: FiMessageSquare, label: 'Communauté' },
    { path: '/leaderboard', icon: FiAward, label: 'Classement' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-base-200 ${collapsed ? 'w-20' : 'w-64'} z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <ul className="menu p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 border border-transparent
                    ${isActive(item.path)
                      ? 'bg-primary text-primary-content shadow-lg shadow-primary/30'
                      : 'hover:bg-base-300/70 hover:border-base-300'}
                  `}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
          {/** Auth-only link */}
          {useAuth().user && (
            <li>
              <Link to="/my-profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive('/my-profile') ? 'bg-primary text-primary-content' : 'hover:bg-base-300/70'}`} onClick={onClose}>
                <FiUser className="w-5 h-5" />
                {!collapsed && <span className="font-medium">Mon Profil</span>}
              </Link>
            </li>
          )}
        </ul>

        <div className="p-4 mt-4 border-t border-base-300">
          <div className="flex items-center justify-between mb-3">
            {!collapsed && (
              <h3 className="text-sm font-semibold text-base-content/70">
                Indices
              </h3>
            )}
            <button className="btn btn-ghost btn-xs" onClick={onToggleCollapse}>
              {collapsed ? 'Deplier' : 'Plier'}
            </button>
          </div>
          {!collapsed && (
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
          )}
        </div>
      </aside>
    </>
  );
};
