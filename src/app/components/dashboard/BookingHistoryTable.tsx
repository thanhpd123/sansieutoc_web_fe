import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpDown, ChevronDown, ChevronUp, RotateCcw, ExternalLink } from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string; dot: string }> = {
  upcoming: {
    label: 'Upcoming',
    classes: 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/25',
    dot: 'bg-[#00ff88]',
  },
  completed: {
    label: 'Completed',
    classes: 'text-gray-400 bg-white/5 border-white/10',
    dot: 'bg-gray-500',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'text-red-400 bg-red-400/10 border-red-400/25',
    dot: 'bg-red-400',
  },
};

const SPORT_EMOJIS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  badminton: '🏸',
  tennis: '🎾',
  volleyball: '🏐',
};

type SortKey = 'date' | 'price' | 'status';

interface BookingHistoryTableProps {
  bookings: Booking[];
}

export function BookingHistoryTable({ bookings }: BookingHistoryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...bookings].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
    if (sortKey === 'price') cmp = a.totalPrice - b.totalPrice;
    if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#00ff88]" />
      : <ChevronDown className="w-3 h-3 text-[#00ff88]" />;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-white font-semibold">Booking History</h3>
        <span className="text-gray-500 text-xs">{bookings.length} records</span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {[
                { label: 'Field', key: null },
                { label: 'Date', key: 'date' as SortKey },
                { label: 'Time', key: null },
                { label: 'Total', key: 'price' as SortKey },
                { label: 'Status', key: 'status' as SortKey },
                { label: 'Action', key: null },
              ].map(({ label, key }) => (
                <th
                  key={label}
                  onClick={() => key && handleSort(key)}
                  className={`text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    key ? 'cursor-pointer hover:text-gray-300 select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    {key && <SortIcon k={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((booking, i) => {
              const status = STATUS_CONFIG[booking.status];
              return (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Field */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={booking.fieldImage}
                          alt={booking.fieldName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-sm">
                          {/* overlay */}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium leading-tight">{booking.fieldName}</p>
                        <p className="text-gray-500 text-xs">
                          {SPORT_EMOJIS[booking.sportType]} {booking.sportType.charAt(0).toUpperCase() + booking.sportType.slice(1)} · {booking.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-gray-300 text-sm whitespace-nowrap">
                    {formatDate(booking.date)}
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3.5">
                    <span className="text-gray-300 text-sm">{booking.timeSlot}</span>
                    <span className="text-gray-600 text-xs ml-1">· {booking.duration}h</span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5 text-white font-semibold text-sm whitespace-nowrap">
                    {formatPrice(booking.totalPrice)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.classes}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${booking.status === 'upcoming' ? 'animate-pulse' : ''}`} />
                      {status.label}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </motion.button>
                      {booking.status !== 'upcoming' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg text-[#00ff88] text-xs hover:bg-[#00ff88]/20 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Rebook
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/[0.04]">
        {sorted.map((booking, i) => {
          const status = STATUS_CONFIG[booking.status];
          const isExpanded = expandedId === booking.id;
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                className="w-full px-4 py-4 flex items-center gap-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : booking.id)}
              >
                <img
                  src={booking.fieldImage}
                  alt={booking.fieldName}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{booking.fieldName}</p>
                  <p className="text-gray-500 text-xs">{formatDate(booking.date)} · {booking.timeSlot}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`px-2 py-0.5 rounded-full border text-xs font-medium ${status.classes}`}>
                    {status.label}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-gray-300">{booking.duration}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Paid</span>
                        <span className="text-white font-semibold">{formatPrice(booking.totalPrice)}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-medium">
                          View Details
                        </button>
                        {booking.status !== 'upcoming' && (
                          <button className="flex-1 py-2 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg text-[#00ff88] text-xs font-medium">
                            Rebook
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
