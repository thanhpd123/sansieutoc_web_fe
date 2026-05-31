import { motion } from "motion/react";
import { Zap, Clock, Target, Shield, Users, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Book your field in under 60 seconds",
    size: "large",
    gradient: "from-[#00ff88] to-[#00d4ff]",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    description: "Live updates on field status",
    size: "small",
    gradient: "from-[#00d4ff] to-[#0099ff]",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "AI-powered field recommendations",
    size: "small",
    gradient: "from-[#ff006e] to-[#ff4d8f]",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions guaranteed",
    size: "medium",
    gradient: "from-[#ffbe0b] to-[#ff9500]",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Organize your squad effortlessly",
    size: "medium",
    gradient: "from-[#8338ec] to-[#b055ff]",
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    description: "Track your booking analytics",
    size: "large",
    gradient: "from-[#00ff88] to-[#00ff88]",
  },
];

export function FeaturesBento() {
  return (
    <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Why Choose
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff]">
              Sân Siêu Tốc?
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Engineered for speed, built for athletes. Experience the future of
            sports field booking.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === "large";
            const isMedium = feature.size === "medium";

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden
                  ${isLarge ? "md:col-span-2" : ""}
                  ${isMedium ? "md:row-span-1" : ""}`}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Border glow */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.3), transparent)`,
                    filter: "blur(20px)",
                  }}
                />

                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-full h-full text-black" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg">{feature.description}</p>

                  {/* Decorative element */}
                  <div className="mt-auto pt-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#00ff88] to-transparent rounded-full" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
