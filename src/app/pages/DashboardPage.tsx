import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Trophy, Star, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Sidebar } from '../components/dashboard/Sidebar';
import { NextMatchWidget } from '../components/dashboard/NextMatchWidget';
import { BookingHistoryTable } from '../components/dashboard/BookingHistoryTable';
import { MOCK_BOOKINGS, MOCK_USER } from '../data/mockData';

const upcomingBookings = MOCK_BOOKINGS.filter((b) => b.status === 'upcoming');
const nextMatch = upcomingBookings.sort((a, b) => a.date.localeCompare(b.date))[0];

const STATS = [
  {
    label: 'Total Bookings',
    value: '47',
    sub: '+3 this month',
    icon: Calendar,
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.15)',
  },
  {
    label: 'Hours Played',
    value: '94h',
    sub: '~2h per session',
    icon: Clock,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.15)',
  },
  {
    label: 'Favorite Sport',
    value: 'Football',
    sub: '31 sessions',
    icon: Trophy,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
  },
  {
    label: 'Member Since',
    value: 'Gold',
    sub: 'Mar 2024',
    icon: Star,
    color: '#facc15',
    glow: 'rgba(250,204,21,0.15)',
  },
];

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('overview');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="pt-[72px] h-screen flex overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-gray-500 text-sm mb-1">{formatDate()}</p>
              <h1 className="text-white text-3xl font-bold">
                {greeting()}, <span className="text-[#00ff88]">{MOCK_USER.name.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {MOCK_USER.level} · {MOCK_USER.totalBookings} total bookings
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#00ff88] text-black font-semibold rounded-xl text-sm hover:shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-shadow"
              >
                <LinkIcon className="w-4 h-4" />
                Find & Book
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="relative p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden group hover:border-white/[0.12] transition-colors"
                >
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 100%, ${stat.glow}, transparent 70%)` }}
                  />

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: stat.glow }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Next Match Widget */}
          {nextMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Next Match</h2>
                <span className="text-gray-500 text-sm">
                  {upcomingBookings.length} upcoming
                </span>
              </div>
              <NextMatchWidget booking={nextMatch} />
            </motion.div>
          )}

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="md:col-span-2 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white font-semibold mb-4 text-sm">Activity This Month</h3>
              <div className="flex items-end gap-1 h-20">
                {[3, 5, 2, 7, 4, 6, 3, 8, 5, 4, 7, 6, 2, 5, 3, 9, 4, 6, 3, 5, 7, 4, 6, 8, 3, 5, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.5 + i * 0.02, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: `${(h / 9) * 100}%`, transformOrigin: 'bottom' }}
                    className={`flex-1 rounded-sm ${i === 26 ? 'bg-[#00ff88]' : 'bg-white/10 hover:bg-[#00ff88]/40'} transition-colors cursor-pointer`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-gray-600 text-xs mt-2">
                <span>May 1</span>
                <span>Today</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-white font-semibold mb-4 text-sm">Sport Breakdown</h3>
              <div className="space-y-3">
                {[
                  { sport: 'Football', pct: 66, color: '#00ff88' },
                  { sport: 'Basketball', pct: 21, color: '#00d4ff' },
                  { sport: 'Badminton', pct: 13, color: '#a78bfa' },
                ].map(({ sport, pct, color }) => (
                  <div key={sport}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{sport}</span>
                      <span style={{ color }} className="font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BookingHistoryTable bookings={MOCK_BOOKINGS} />
          </motion.div>

          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}
