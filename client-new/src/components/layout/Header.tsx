import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiSearch } from 'react-icons/fi';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex-none lg:hidden">
        <button className="btn btn-square btn-ghost" onClick={onMenuToggle}>
          <FiMenu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
          <span className="text-primary">BRX</span>
          <span className="text-accent">.MA</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {/* Search */}
        <div className="form-control hidden md:block">
          <div className="input-group">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered input-sm"
            />
            <button className="btn btn-square btn-sm">
              <FiSearch className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          {theme === 'light' ? (
            <FiMoon className="w-5 h-5" />
          ) : (
            <FiSun className="w-5 h-5" />
          )}
        </button>

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
              <span className="text-sm">U</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/portfolio">Mon Portfolio</Link>
            </li>
            <li>
              <Link to="/settings">Paramètres</Link>
            </li>
            <li>
              <a>Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
