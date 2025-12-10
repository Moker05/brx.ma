import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiLogOut, FiUser } from 'react-icons/fi';
import { ThemeSelector } from '@/components/theme';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  return (
    <header className="navbar h-14 px-4 bg-base-100/70 backdrop-blur-xl border-b border-white/5 shadow-lg relative z-40">
      <div className="flex-none lg:hidden">
        <button className="btn btn-square btn-ghost" onClick={onMenuToggle}>
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold gap-3 px-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary font-black tracking-wide">
            B
          </div>
          <div className="leading-tight text-left">
            <div className="text-sm text-base-content/60 uppercase tracking-[0.28em]">BRX</div>
            <div className="text-lg font-extrabold text-primary">Markets</div>
          </div>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {/* Search */}
        <div className="form-control hidden md:block">
          <div className="input-group">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered input-sm bg-base-200/70"
            />
            <button className="btn btn-square btn-sm">
              <FiSearch className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Auth Section */}
        {isAuthenticated && user ? (
          /* User Menu - Authenticated */
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-40 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
            >
              <li className="menu-title">
                <span className="text-xs opacity-60">
                  {user.email}
                </span>
              </li>
              <li>
                <Link to="/dashboard">
                  <FiUser className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-profile">
                  <FiUser className="w-4 h-4" />
                  Mon Profil
                </Link>
              </li>
              <li>
                <Link to="/portfolio">Mon Portfolio</Link>
              </li>
              <li>
                <Link to="/trading">Trading virtuel</Link>
              </li>
              <li className="border-t border-base-300 mt-2">
                <a onClick={logout} className="text-error">
                  <FiLogOut className="w-4 h-4" />
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        ) : (
          /* Login/Register Buttons - Not Authenticated */
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
