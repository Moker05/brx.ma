import { Link } from 'react-router-dom';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { ThemeSelector } from '@/components/theme';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {

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

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
              <span className="text-sm">U</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-40 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li>
              <Link to="/portfolio">Mon Portfolio</Link>
            </li>
            <li>
              <Link to="/trading">Trading virtuel</Link>
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
