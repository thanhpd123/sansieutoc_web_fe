import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, Star, MapPin, Clock, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { Field, TimeSlot } from '../types';
import { SPORTS_EXTRAS, formatVND } from '../data/mockData';

interface BookingModalProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

const DURATIONS = [
  { value: 1, label: '1 hour' },
  { value: 1.5, label: '1.5 hours' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit Card', icon: CreditCard },
  { id: 'wallet', label: 'E-Wallet', icon: Wallet },
  { id: 'bank', label: 'Banking App', icon: Smartphone },
];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const STEP_LABELS = ['Time', 'Extras', 'Payment', 'Done'];

export function BookingModal({ field, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [duration, setDuration] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [confirmed, setConfirmed] = useState(false);

  if (!field) return null;

  const extrasTotal = Array.from(selectedExtras).reduce((sum, id) => {
    const extra = SPORTS_EXTRAS.find((e) => e.id === id);
    return sum + (extra?.price ?? 0);
  }, 0);

  const fieldTotal = field.price * duration;
  const grandTotal = fieldTotal + extrasTotal;

  const goTo = (nextStep: Step) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    setDirection(1);
    setStep(4);
    setConfirmed(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedSlot(null);
      setDuration(1);
      setSelectedExtras(new Set());
      setPaymentMethod('card');
      setConfirmed(false);
      setDirection(1);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-[#0c0c0c] border-l border-white/[0.08] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white font-semibold text-lg">{field.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <MapPin className="w-3 h-3" />{field.location}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{field.rating}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicator */}
            {step < 4 && (
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  {STEP_LABELS.slice(0, 3).map((label, i) => {
                    const stepNum = (i + 1) as Step;
                    const isPast = step > stepNum;
                    const isCurrent = step === stepNum;
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                          isPast
                            ? 'bg-[#00ff88] text-black'
                            : isCurrent
                            ? 'bg-[#00ff88]/20 border border-[#00ff88] text-[#00ff88]'
                            : 'bg-white/5 border border-white/10 text-gray-500'
                        }`}>
                          {isPast ? <Check className="w-3.5 h-3.5" /> : stepNum}
                        </div>
                        <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isPast ? 'text-[#00ff88]' : 'text-gray-500'}`}>
                          {label}
                        </span>
                        {i < 2 && (
                          <div className={`flex-1 h-px w-8 mx-1 transition-colors duration-300 ${step > stepNum ? 'bg-[#00ff88]/40' : 'bg-white/10'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6"
                  >
                    <h3 className="text-white font-semibold mb-1">Choose Your Time</h3>
                    <p className="text-gray-400 text-sm mb-5">Select an available slot and duration</p>

                    {/* Field image */}
                    <div className="relative h-36 rounded-xl overflow-hidden mb-5">
                      <img src={field.images[0]} alt={field.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 right-3 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1">
                        <span className="text-[#00ff88] font-semibold text-sm">
                          {formatVND(field.price)}/hr
                        </span>
                      </div>
                    </div>

                    {/* Time slots */}
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Available Times</p>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {field.availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            !slot.available
                              ? 'text-gray-600 border-white/[0.05] bg-white/[0.02] cursor-not-allowed line-through'
                              : selectedSlot?.id === slot.id
                              ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_16px_rgba(0,255,136,0.3)]'
                              : 'text-gray-300 border-white/10 bg-white/5 hover:border-[#00ff88]/40 hover:text-[#00ff88]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            {slot.time}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Duration */}
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Duration</p>
                    <div className="grid grid-cols-4 gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setDuration(d.value)}
                          className={`py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                            duration === d.value
                              ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_16px_rgba(0,255,136,0.3)]'
                              : 'text-gray-300 border-white/10 bg-white/5 hover:border-[#00ff88]/40 hover:text-[#00ff88]'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6"
                  >
                    <h3 className="text-white font-semibold mb-1">Enhance Your Game</h3>
                    <p className="text-gray-400 text-sm mb-5">Add optional extras to your booking</p>

                    <div className="grid grid-cols-1 gap-3">
                      {SPORTS_EXTRAS.map((extra) => {
                        const isSelected = selectedExtras.has(extra.id);
                        return (
                          <motion.button
                            key={extra.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleExtra(extra.id)}
                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-[#00ff88]/40 bg-[#00ff88]/5'
                                : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <span className="text-2xl">{extra.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isSelected ? 'text-[#00ff88]' : 'text-white'}`}>
                                {extra.name}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5">{extra.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`text-sm font-semibold ${isSelected ? 'text-[#00ff88]' : 'text-gray-300'}`}>
                                +{formatVND(extra.price)}
                              </span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-[#00ff88] border-[#00ff88]'
                                  : 'border-white/20'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6"
                  >
                    <h3 className="text-white font-semibold mb-1">Confirm & Pay</h3>
                    <p className="text-gray-400 text-sm mb-5">Review your booking details</p>

                    {/* Order summary */}
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-5">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {field.name} — {selectedSlot?.time || '—'} ({duration}h)
                          </span>
                          <span className="text-white font-medium">{formatVND(fieldTotal)}</span>
                        </div>
                        {Array.from(selectedExtras).map((id) => {
                          const extra = SPORTS_EXTRAS.find((e) => e.id === id);
                          if (!extra) return null;
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span className="text-gray-400">{extra.emoji} {extra.name}</span>
                              <span className="text-white font-medium">+{formatVND(extra.price)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t border-white/[0.08] pt-2 mt-2 flex justify-between">
                          <span className="text-white font-semibold">Total</span>
                          <span className="text-[#00ff88] font-bold text-lg">{formatVND(grandTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment method */}
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Payment Method</p>
                    <div className="space-y-2 mb-5">
                      {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                            paymentMethod === id
                              ? 'border-[#00ff88]/40 bg-[#00ff88]/5'
                              : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            paymentMethod === id ? 'bg-[#00ff88]/20' : 'bg-white/5'
                          }`}>
                            <Icon className={`w-4 h-4 ${paymentMethod === id ? 'text-[#00ff88]' : 'text-gray-400'}`} />
                          </div>
                          <span className={`text-sm font-medium ${paymentMethod === id ? 'text-[#00ff88]' : 'text-gray-300'}`}>
                            {label}
                          </span>
                          <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                            paymentMethod === id ? 'border-[#00ff88] bg-[#00ff88]' : 'border-white/20'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/30 flex items-center justify-center mb-6"
                      style={{ boxShadow: '0 0 60px rgba(0,255,136,0.2)' }}
                    >
                      <Check className="w-10 h-10 text-[#00ff88]" strokeWidth={2.5} />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white font-bold text-2xl mb-2"
                    >
                      Booking Confirmed!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-400 text-sm mb-6 max-w-xs"
                    >
                      Your booking at <span className="text-white font-medium">{field.name}</span> for {selectedSlot?.time} ({duration}h) has been confirmed.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 mb-6 text-left w-full"
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Booking ID</span>
                        <span className="text-[#00ff88] font-mono font-medium">#SST-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Paid</span>
                        <span className="text-white font-semibold">{formatVND(grandTotal)}</span>
                      </div>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleClose}
                      className="w-full py-3 bg-[#00ff88] text-black font-semibold rounded-xl hover:shadow-[0_0_24px_rgba(0,255,136,0.3)] transition-shadow"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            {step < 4 && (
              <div className="px-6 py-5 border-t border-white/[0.06] bg-[#0c0c0c]">
                {/* Price preview */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Total</span>
                  <div className="text-right">
                    <span className="text-[#00ff88] font-bold text-xl">{formatVND(grandTotal)}</span>
                    {extrasTotal > 0 && (
                      <p className="text-gray-500 text-xs">incl. {formatVND(extrasTotal)} extras</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {step > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => goTo((step - 1) as Step)}
                      className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => step < 3 ? goTo((step + 1) as Step) : handleConfirm()}
                    disabled={step === 1 && !selectedSlot}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      step === 1 && !selectedSlot
                        ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                        : step === 3
                        ? 'bg-[#00ff88] text-black hover:shadow-[0_0_24px_rgba(0,255,136,0.3)]'
                        : 'bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88]'
                    }`}
                  >
                    {step === 3 ? 'Confirm Booking' : 'Continue'}
                    {step < 3 && <ChevronRight className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
