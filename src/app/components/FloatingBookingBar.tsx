import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, Calendar, Trophy } from "lucide-react";
import { useState } from "react";

export function FloatingBookingBar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [100, 200], [0, 1]);
  const y = useTransform(scrollY, [100, 200], [100, 0]);

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [sport, setSport] = useState("");

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6"
    >
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location */}
          <div className="flex-1 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00ff88] transition-colors" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
            />
          </div>

          {/* Date */}
          <div className="flex-1 relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00ff88] transition-colors" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Sport Type */}
          <div className="flex-1 relative group">
            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00ff88] transition-colors" />
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#00ff88] transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0a0a]">Sport Type</option>
              <option value="football" className="bg-[#0a0a0a]">Football</option>
              <option value="basketball" className="bg-[#0a0a0a]">Basketball</option>
              <option value="tennis" className="bg-[#0a0a0a]">Tennis</option>
              <option value="badminton" className="bg-[#0a0a0a]">Badminton</option>
            </select>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00ff88] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#00d4ff] transition-colors"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
