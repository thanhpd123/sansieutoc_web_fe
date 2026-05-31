import { motion, AnimatePresence } from 'motion/react';
import { Link, NavLink } from 'react-router';
import {
  LayoutDashboard, Calendar, Search, Bell, User, Settings,
  LogOut, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

const TOP_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'find', label: 'Find Fields', icon: Search, href: '/search' },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function Sidebar({ collapsed, onToggle, activeItem, onItemClick }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative h-full bg-[#080808] border-r border-white/[0.06] flex flex-col overflow-hidden shrink-0"
    >
      {/* Logo area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 bg-[#00ff88] rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-white font-semibold text-sm whitespace-nowrap">Sân Siêu Tốc</span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="w-7 h-7 bg-[#00ff88] rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-lg"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />}
      </motion.button>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {TOP_ITEMS.map(({ id, label, icon: Icon, href }) => {
          const isActive = activeItem === id;
          const content = (
            <div
              onClick={() => !href && onItemClick(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                isActive
                  ? 'bg-[#00ff88]/10 text-[#00ff88]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00ff88]' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-0.5 h-6 bg-[#00ff88] rounded-r-full"
                />
              )}
            </div>
          );

          return (
            <div key={id} className="relative">
              {href ? (
                <Link to={href}>{content}</Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: logout */}
      <div className="px-2 pb-4 border-t border-white/[0.06] pt-3 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-gray-600 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200">
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
