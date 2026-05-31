import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ChevronDown, Calendar, Clock, X, SlidersHorizontal } from 'lucide-react';
import { FilterState, SportType } from '../types';

const LOCATIONS = ['all', 'Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Phú Nhuận', 'Gò Vấp', 'Tân Bình', 'Thủ Đức'];
const SPORT_TYPES: Array<{ value: SportType | 'all'; label: string; emoji: string }> = [
  { value: 'all', label: 'All Sports', emoji: '🏆' },
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
];

interface DropdownProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  options: Array<{ value: string; label: string; prefix?: string }>;
  onChange: (v: string) => void;
}

function Dropdown({ label, value, icon, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isActive = value !== 'all' && value !== '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 whitespace-nowrap ${
          isActive
            ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]'
            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
        }`}
      >
        <span className="text-current">{icon}</span>
        <span>{selected?.prefix || ''}{selected?.label || label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 min-w-[180px] z-50 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors duration-150 ${
                  opt.value === value
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt.prefix && <span>{opt.prefix}</span>}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount?: number;
}

export function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const activeFiltersCount = [
    filters.location !== 'all',
    filters.sportType !== 'all',
    !!filters.date,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({ location: 'all', sportType: 'all', date: '', timeFrom: '', timeTo: '' });

  return (
    <div className="sticky top-[72px] z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-full px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 text-gray-500 shrink-0 mr-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Filter</span>
        </div>

        <Dropdown
          label="Location"
          value={filters.location}
          icon={<MapPin className="w-3.5 h-3.5" />}
          options={LOCATIONS.map((l) => ({ value: l, label: l === 'all' ? 'All Areas' : l }))}
          onChange={(v) => onChange({ ...filters, location: v })}
        />

        <Dropdown
          label="Sport Type"
          value={filters.sportType}
          icon={<span className="text-base leading-none">{SPORT_TYPES.find((s) => s.value === filters.sportType)?.emoji || '🏆'}</span>}
          options={SPORT_TYPES.map((s) => ({ value: s.value, label: s.label, prefix: s.emoji + ' ' }))}
          onChange={(v) => onChange({ ...filters, sportType: v as SportType | 'all' })}
        />

        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ ...filters, date: e.target.value })}
              className="bg-transparent text-gray-400 outline-none text-sm [color-scheme:dark] cursor-pointer"
              placeholder="Date"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm shrink-0">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="time"
            value={filters.timeFrom}
            onChange={(e) => onChange({ ...filters, timeFrom: e.target.value })}
            className="bg-transparent text-gray-400 outline-none text-sm [color-scheme:dark] w-20"
          />
          <span className="text-gray-600">—</span>
          <input
            type="time"
            value={filters.timeTo}
            onChange={(e) => onChange({ ...filters, timeTo: e.target.value })}
            className="bg-transparent text-gray-400 outline-none text-sm [color-scheme:dark] w-20"
          />
        </div>

        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium shrink-0 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear ({activeFiltersCount})
            </motion.button>
          )}
        </AnimatePresence>

        <div className="ml-auto shrink-0 text-xs text-gray-500">
          {resultCount !== undefined && (
            <span><span className="text-white font-medium">{resultCount}</span> results</span>
          )}
        </div>
      </div>
    </div>
  );
}
