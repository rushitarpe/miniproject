import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  LogOut,
  User,
  ChevronRight,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Task Board', icon: ClipboardList },
];

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col glass-card rounded-none border-r border-white/10 z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ClipboardList size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">TaskManager</h1>
            <p className="text-xs text-slate-500">Team Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <span className={`text-xs font-medium ${isAdmin ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {isAdmin ? '👑 Admin' : '👤 Member'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
