import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Star, ChevronLeft, ChevronRight, Wifi, Wind } from 'lucide-react';
import { Field } from '../types';

const SPORT_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  badminton: 'Badminton',
  tennis: 'Tennis',
  volleyball: 'Volleyball',
};

const SPORT_COLORS: Record<string, string> = {
  football: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  basketball: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  badminton: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  tennis: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  volleyball: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

interface FieldCardProps {
  field: Field;
  onBook: (field: Field) => void;
}

export function FieldCard({ field, onBook }: FieldCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setImgIdx((p) => (p - 1 + field.images.length) % field.images.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setImgIdx((p) => (p + 1) % field.images.length);
  };

  const availableSlots = field.availableSlots.filter((s) => s.available);
  const visibleSlots = availableSlots.slice(0, 3);
  const extraSlots = availableSlots.length - 3;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer hover:border-[#00ff88]/30 transition-colors duration-300"
      style={{
        boxShadow: isHovered ? '0 0 40px rgba(0,255,136,0.06)' : 'none',
      }}
    >
      {/* Image Carousel */}
      <div className="relative h-52 overflow-hidden bg-[#111]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={imgIdx}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            src={field.images[imgIdx]}
            alt={field.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Sport badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${SPORT_COLORS[field.sportType]}`}>
          {SPORT_LABELS[field.sportType]}
        </div>

        {/* Indoor/Outdoor badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-gray-300 border border-white/10">
          {field.isIndoor ? (
            <><Wind className="w-3 h-3" /> Indoor</>
          ) : (
            <><Wifi className="w-3 h-3 rotate-45" /> Outdoor</>
          )}
        </div>

        {/* Carousel controls */}
        {field.images.length > 1 && (
          <>
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {field.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                  className={`rounded-full transition-all duration-200 ${
                    i === imgIdx ? 'w-4 h-1.5 bg-[#00ff88]' : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1">
          <span className="text-[#00ff88] font-semibold text-sm">{formatPrice(field.price)}</span>
          <span className="text-gray-400 text-xs">/hr</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="text-white font-semibold text-base leading-tight">{field.name}</h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-medium">{field.rating}</span>
            <span className="text-gray-500 text-xs">({field.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{field.address}</span>
          <span className="shrink-0 text-[#00ff88] text-xs ml-1">{field.distance}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {field.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs text-gray-500 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
          {field.amenities.length > 3 && (
            <span className="text-xs text-gray-500">+{field.amenities.length - 3}</span>
          )}
        </div>

        {/* Available time slots */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleSlots.map((slot) => (
            <span
              key={slot.id}
              className="text-xs text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 px-2.5 py-1 rounded-full font-medium"
            >
              {slot.time}
            </span>
          ))}
          {availableSlots.length === 0 && (
            <span className="text-xs text-gray-500 italic">No slots available today</span>
          )}
          {extraSlots > 0 && (
            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              +{extraSlots} more
            </span>
          )}
        </div>

        {/* Book Now */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onBook(field)}
          className="w-full py-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-sm font-semibold hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] hover:shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-all duration-300"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}
