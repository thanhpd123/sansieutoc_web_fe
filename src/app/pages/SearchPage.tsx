import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, List, ArrowUpDown } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { FieldCard } from '../components/FieldCard';
import { MapView } from '../components/MapView';
import { BookingModal } from '../components/BookingModal';
import { MOCK_FIELDS } from '../data/mockData';
import { Field, FilterState } from '../types';

type SortOption = 'distance' | 'price_asc' | 'price_desc' | 'rating';

const SORT_LABELS: Record<SortOption, string> = {
  distance: 'Nearest',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  rating: 'Top Rated',
};

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    sportType: 'all',
    date: '',
    timeFrom: '',
    timeTo: '',
  });
  const [showMap, setShowMap] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const filteredFields = useMemo(() => {
    let result = MOCK_FIELDS.filter((field) => {
      if (filters.location !== 'all' && field.location !== filters.location) return false;
      if (filters.sportType !== 'all' && field.sportType !== filters.sportType) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

    return result;
  }, [filters, sortBy]);

  const handleBook = (field: Field) => {
    setSelectedField(field);
    setIsBookingOpen(true);
  };

  return (
    <div className="pt-[72px] h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      <FilterBar filters={filters} onChange={setFilters} resultCount={filteredFields.length} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — field list */}
        <AnimatePresence initial={false}>
          {(!showMap || true) && (
            <motion.div
              className={`flex flex-col overflow-y-auto bg-[#0a0a0a] ${
                showMap ? 'hidden lg:flex lg:w-[480px] xl:w-[520px]' : 'flex-1'
              }`}
            >
              {/* Sort bar */}
              <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <p className="text-gray-500 text-sm">
                  <span className="text-white font-semibold">{filteredFields.length}</span> fields found
                </p>

                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {SORT_LABELS[sortBy]}
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                      >
                        {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => { setSortBy(key); setSortOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              sortBy === key
                                ? 'text-[#00ff88] bg-[#00ff88]/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Field cards */}
              <div className="p-4 space-y-4">
                {filteredFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-white font-semibold mb-1">No fields found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredFields.map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      <FieldCard field={field} onBook={handleBook} />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right panel — map */}
        <div
          className={`relative flex-1 transition-all duration-300 ${
            showMap ? 'flex' : 'hidden'
          }`}
        >
          <MapView fields={filteredFields} onFieldSelect={handleBook} />

          {/* Map/List toggle — mobile */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 lg:hidden">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-full text-white text-sm font-medium shadow-2xl"
            >
              {showMap ? (
                <><List className="w-4 h-4 text-[#00ff88]" /> Show List</>
              ) : (
                <><Map className="w-4 h-4 text-[#00ff88]" /> Show Map</>
              )}
            </motion.button>
          </div>

          {/* Map/List toggle — desktop */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowMap(!showMap)}
            className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 z-20 items-center gap-2 px-4 py-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full text-sm text-white hover:border-white/20 transition-colors shadow-lg"
          >
            {showMap ? (
              <><List className="w-3.5 h-3.5 text-[#00ff88]" /> Hide Map</>
            ) : (
              <><Map className="w-3.5 h-3.5 text-[#00ff88]" /> Show Map</>
            )}
          </motion.button>
        </div>
      </div>

      <BookingModal
        field={selectedField}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
