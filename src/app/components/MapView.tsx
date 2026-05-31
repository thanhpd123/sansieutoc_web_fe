import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { Field } from '../types';

const SPORT_COLORS: Record<string, string> = {
  football: '#00ff88',
  basketball: '#f97316',
  badminton: '#60a5fa',
  tennis: '#facc15',
  volleyball: '#a78bfa',
};

interface MapViewProps {
  fields: Field[];
  onFieldSelect: (field: Field) => void;
}

export function MapView({ fields, onFieldSelect }: MapViewProps) {
  const [hoveredField, setHoveredField] = useState<Field | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <div className="relative h-full w-full bg-[#080b0f] overflow-hidden">
      {/* Map grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff88" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-large" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#grid)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#00ff88" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-large)" />
      </svg>

      {/* Ambient glow effects */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Simulated road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="45%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,4" />
        <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="1" strokeDasharray="6,4" />
        <line x1="30%" y1="0" x2="35%" y2="100%" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,4" />
        <line x1="65%" y1="0" x2="60%" y2="100%" stroke="#ffffff" strokeWidth="1" strokeDasharray="6,4" />
        <ellipse cx="50%" cy="55%" rx="12%" ry="8%" fill="none" stroke="#ffffff" strokeWidth="0.8" />
      </svg>

      {/* Map label */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
        <Layers className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400 text-xs">Ho Chi Minh City</span>
      </div>

      {/* Field markers */}
      {fields.map((field) => {
        const color = SPORT_COLORS[field.sportType] || '#00ff88';
        const isHovered = hoveredField?.id === field.id;
        const isSelected = selectedField?.id === field.id;

        return (
          <div
            key={field.id}
            className="absolute z-20 cursor-pointer"
            style={{ left: `${field.mapX}%`, top: `${field.mapY}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredField(field)}
            onMouseLeave={() => setHoveredField(null)}
            onClick={() => setSelectedField(isSelected ? null : field)}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: color }}
              animate={{
                scale: [1, 2.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
            />

            {/* Marker dot */}
            <motion.div
              className="relative w-4 h-4 rounded-full border-2 border-[#0a0a0a] shadow-lg"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.4 }}
              animate={{ scale: isSelected ? 1.4 : 1 }}
            />

            {/* Hover tooltip */}
            <AnimatePresence>
              {(isHovered || isSelected) && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-52 bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60 pointer-events-none"
                >
                  <img
                    src={field.images[0]}
                    alt={field.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold leading-tight">{field.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{field.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color }}>
                        {formatPrice(field.price)}/hr
                      </span>
                      <span className="text-xs text-gray-400">⭐ {field.rating}</span>
                    </div>
                    <button
                      className="mt-2 w-full text-xs py-1.5 rounded-lg font-medium text-black pointer-events-auto"
                      style={{ backgroundColor: color }}
                      onClick={(e) => { e.stopPropagation(); onFieldSelect(field); }}
                    >
                      Book Now
                    </button>
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#0f0f0f] border-r border-b border-white/10"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-xl p-3">
        <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wider">Legend</p>
        <div className="space-y-1.5">
          {Object.entries(SPORT_COLORS).map(([sport, color]) => (
            fields.some((f) => f.sportType === sport) && (
              <div key={sport} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-400 text-xs capitalize">{sport}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Navigation button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-[#00ff88] rounded-full flex items-center justify-center shadow-lg shadow-[#00ff88]/20"
      >
        <Navigation className="w-4 h-4 text-black" />
      </motion.button>

      {/* Field count pill */}
      <div className="absolute top-4 left-4 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#00ff88]/20 rounded-full px-3 py-1.5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
        <span className="text-[#00ff88] text-xs font-medium">{fields.length} fields nearby</span>
      </div>
    </div>
  );
}
