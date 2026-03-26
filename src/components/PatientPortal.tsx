import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle2, BrainCircuit } from 'lucide-react';

export default function PatientPortalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'auth' | 'booking'>('auth');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Dummy AI assessment trigger to mimic Groq integration
  const handleAnalyze = () => {
    setIsAnalysing(true);
    setTimeout(() => {
      setIsAnalysing(false);
      setAiResult("Based on your symptoms (fever, body ache), it suggests a viral infection. We recommend a general physician.");
    }, 2500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full bg-(--color-forest) text-white shadow-[0_8px_32px_rgba(31,61,46,0.4)] flex items-center justify-center hover:scale-105 hover:bg-(--color-forest-2) transition-all"
      >
        <UserCircle2 size={32} />
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-(--color-cream) rounded-full"></span>
      </button>

      {/* Portal Overlay Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 z-[100] w-[400px] max-h-[80vh] bg-white border border-[rgba(26,26,24,0.12)] shadow-[0_40px_100px_rgba(26,26,24,0.15)] flex flex-col overflow-hidden rounded-sm"
          >
            {/* Header */}
            <div className="bg-(--color-forest) text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Patient Portal</h3>
                  <p className="font-mono text-[0.6rem] tracking-widest uppercase text-(--color-sage-2)">MediCare+ Secure Access</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
              {step === 'auth' ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="font-serif text-2xl text-(--color-ink) mb-1">Welcome back.</h4>
                    <p className="text-sm font-light text-(--color-muted)">Sign in to manage appointments.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <input className="w-full p-4 border border-[rgba(26,26,24,0.12)] bg-white text-sm outline-hidden focus:border-(--color-forest) transition-colors" placeholder="Patient ID (e.g. MCR-XXXX)" />
                    <input type="password" className="w-full p-4 border border-[rgba(26,26,24,0.12)] bg-white text-sm outline-hidden focus:border-(--color-forest) transition-colors" placeholder="Password" />
                    <button onClick={() => setStep('booking')} className="w-full bg-(--color-forest) text-white p-4 font-medium text-xs uppercase tracking-widest hover:bg-(--color-forest-2) transition-colors mt-2">
                      Sign In &rarr;
                    </button>
                  </div>
                  <div className="text-center">
                    <button className="text-xs font-medium text-(--color-muted) hover:text-(--color-forest) transition-colors">Create new account</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="font-mono text-[0.6rem] tracking-widest uppercase text-(--color-sage-2) mb-2">New Appointment</div>
                    <h4 className="font-serif text-xl text-(--color-ink)">Describe your symptoms</h4>
                  </div>
                  <textarea 
                    className="w-full p-4 border border-[rgba(26,26,24,0.12)] bg-white text-sm outline-hidden focus:border-(--color-forest) transition-colors min-h-[120px] resize-none" 
                    placeholder="E.g., I've been experiencing a sharp chest pain since yesterday..." 
                  />
                  
                  {aiResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[rgba(90,125,101,0.08)] border border-[rgba(90,125,101,0.2)] p-4 text-sm text-(--color-forest) font-light leading-relaxed">
                      <div className="flex items-center gap-2 mb-2 font-medium">
                        <BrainCircuit size={16} className="text-(--color-sage)" /> AI Assessment
                      </div>
                      {aiResult}
                    </motion.div>
                  )}

                  {!aiResult && (
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalysing}
                      className="w-full bg-(--color-forest) text-white p-4 font-medium text-xs uppercase tracking-widest hover:bg-(--color-forest-2) transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isAnalysing ? (
                        <><BrainCircuit size={16} className="animate-pulse" /> Analyzing...</>
                      ) : (
                        'Analyze & Match Specialist →'
                      )}
                    </button>
                  )}

                  {aiResult && (
                    <button className="w-full border-2 border-(--color-forest) text-(--color-forest) p-4 font-medium text-xs uppercase tracking-widest hover:bg-[rgba(31,61,46,0.05)] transition-colors mt-2">
                      Proceed to Payment (Razorpay) &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
