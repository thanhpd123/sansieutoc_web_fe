import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/search', label: 'Find Fields', end: false },
    { to: '/dashboard', label: 'Dashboard', end: false },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center">
        <motion.div
          className="absolute inset-0 border-b border-white/0 transition-all duration-300"
          animate={{
            backgroundColor: scrolled ? 'rgba(10,10,10,0.90)' : 'rgba(10,10,10,0)',
            borderColor: scrolled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#00ff88] rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] transition-shadow duration-300">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-lg">
              Sân <span className="text-[#00ff88]">Siêu Tốc</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-[#00ff88] bg-[#00ff88]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/search"
                className="bg-[#00ff88] text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_0_24px_rgba(0,255,136,0.4)] transition-shadow duration-300"
              >
                Book Now
              </Link>
            </motion.div>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm transition-colors ${
                      isActive
                        ? 'text-[#00ff88] bg-[#00ff88]/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/search"
                onClick={() => setMobileOpen(false)}
                className="mt-2 bg-[#00ff88] text-black text-sm font-semibold px-5 py-3 rounded-xl text-center"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
