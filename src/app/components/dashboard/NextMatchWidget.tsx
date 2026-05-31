import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, Navigation, ChevronRight } from 'lucide-react';
import { Booking } from '../../types';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface NextMatchWidgetProps {
  booking: Booking;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-bold text-white tabular-nums"
        style={{ textShadow: '0 0 20px rgba(0,255,136,0.4)' }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-gray-500 text-xs mt-1 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

const SPORT_EMOJIS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  badminton: '🏸',
  tennis: '🎾',
  volleyball: '🏐',
};

export function NextMatchWidget({ booking }: NextMatchWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const matchDate = new Date(`${booking.date}T${booking.timeSlot}:00`);
      const diff = matchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [booking]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={booking.fieldImage}
          alt={booking.fieldName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Field info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[#00ff88] text-xs font-medium uppercase tracking-wider">Next Match</span>
              </div>
              <span className="text-2xl">{SPORT_EMOJIS[booking.sportType] || '🏆'}</span>
            </div>

            <h3 className="text-white text-2xl font-bold mb-1">{booking.fieldName}</h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00ff88]" />
                {booking.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00ff88]" />
                {formatDate(booking.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00ff88]" />
                {booking.timeSlot} · {booking.duration}h
              </span>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff88] text-black text-sm font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-shadow"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Manage
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Right: Countdown */}
          <div className="lg:shrink-0">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 text-center lg:text-right font-medium">
              Starts in
            </p>
            <div className="flex items-start gap-4">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <div className="text-[#00ff88] text-2xl font-bold mt-1 opacity-60">:</div>
              <CountdownUnit value={timeLeft.hours} label="Hrs" />
              <div className="text-[#00ff88] text-2xl font-bold mt-1 opacity-60">:</div>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <div className="text-[#00ff88] text-2xl font-bold mt-1 opacity-60">:</div>
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>
            <p className="text-gray-600 text-xs mt-3 text-center">{formatPrice(booking.totalPrice)} · Confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
