import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ArrowLeft, Brain, User, CheckCircle, Activity, Zap, CreditCard, Stethoscope, Search } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function BookAppointment() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1
  const [symptoms, setSymptoms] = useState('');
  const [aiAssessment, setAiAssessment] = useState('');
  const [specialization, setSpecialization] = useState('');
  
  // Step 2 & 3
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!user) navigate('/');
    emailjs.init("nEbb9aPtYh8imCD0M");
  }, [user, navigate]);

  // Local keyword-based fallback in case the Cloudflare worker fails
  const localTriage = (text: string): { spec: string; brief: string } => {
    const t = text.toLowerCase();
    if (t.match(/chest pain|heart|palpitation|arrhythmia|cardiac|shortness of breath|angina/)) return { spec: 'Cardiology', brief: 'Symptoms suggest a possible cardiac condition. A Cardiologist is recommended for evaluation.' };
    if (t.match(/headache|migraine|seizure|numbness|tremor|stroke|brain|nerve|dizziness/)) return { spec: 'Neurology', brief: 'Symptoms may indicate a neurological condition. A Neurologist is recommended.' };
    if (t.match(/bone|joint|fracture|back pain|knee|spine|arthritis|sprain|ligament/)) return { spec: 'Orthopedics', brief: 'Musculoskeletal symptoms detected. An Orthopedic specialist is recommended.' };
    if (t.match(/skin|rash|acne|eczema|psoriasis|itching|allergy|hives/)) return { spec: 'Dermatology', brief: 'Skin-related symptoms found. A Dermatologist is recommended.' };
    if (t.match(/child|infant|pediatric|fever in kid|childhood/)) return { spec: 'Pediatrics', brief: 'Pediatric symptoms noted. A Pediatrician is recommended.' };
    if (t.match(/cancer|tumor|chemotherapy|oncology|biopsy|malignant/)) return { spec: 'Oncology', brief: 'Symptoms warrant oncological screening. An Oncologist is recommended.' };
    if (t.match(/anxiety|depression|mental|stress|psychiatric|panic|insomnia/)) return { spec: 'Psychiatry', brief: 'Mental health concerns detected. A Psychiatrist is recommended.' };
    if (t.match(/diabetes|thyroid|hormone|endocrine|insulin|blood sugar/)) return { spec: 'Endocrinology', brief: 'Endocrine-related symptoms. An Endocrinologist is recommended.' };
    if (t.match(/urine|kidney|bladder|urinary|prostate/)) return { spec: 'Urology', brief: 'Urological symptoms detected. A Urologist is recommended.' };
    return { spec: 'General Physician', brief: 'General symptoms noted. A General Physician will assess and route you appropriately.' };
  };

  const analyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    
    let finalSpec = 'General Physician';
    let finalBrief = '';

    try {
      console.log('[Groq] Sending symptoms to Cloudflare Worker...');
      const res = await fetch("https://groqda.subhranilbaul2017.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: symptoms })
      });

      console.log('[Groq] Worker response status:', res.status, res.statusText);

      if (!res.ok) throw new Error(`Worker returned HTTP ${res.status}`);

      const rawText = await res.text();
      console.log('[Groq] Raw response:', rawText);

      try {
        const data = JSON.parse(rawText);
        finalBrief = data.disease_brief || data.response || data.result || rawText;
        finalSpec  = data.specialization || data.specialty || localTriage(rawText).spec;
      } catch {
        // Worker returned plain text — run it through local triage too
        const mapped = localTriage(rawText);
        finalBrief = rawText || mapped.brief;
        finalSpec  = mapped.spec;
      }

      console.log('[Groq] Parsed → Spec:', finalSpec, '| Brief:', finalBrief);

    } catch (err: any) {
      console.warn('[Groq] Worker failed, using local keyword triage. Reason:', err.message);
      const mapped = localTriage(symptoms);
      finalSpec  = mapped.spec;
      finalBrief = `(AI Worker offline — local triage) ${mapped.brief}`;
    }

    setAiAssessment(finalBrief || localTriage(symptoms).brief);
    setSpecialization(finalSpec);
    
    // Query Firestore for matching doctors — also try approved status filter
    try {
      const docQuery = query(
        collection(db, 'doctors'),
        where('speciality', '==', finalSpec),
        where('status', '==', 'approved')
      );
      const snap = await getDocs(docQuery);
      const matched: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`[Firestore] Found ${matched.length} approved ${finalSpec} doctor(s)`);
      setDoctors(matched);
    } catch (err) {
      console.error('[Firestore] Doctor query failed:', err);
      setDoctors([]);
    }

    setStep(2);
    setLoading(false);
  };


  const confirmBooking = async () => {
    if (!selectedDoctor || !date || !time) return alert("Please specify the date and time slot.");
    setLoading(true);

    const options = {
      key: "rzp_live_SRCE9sabTGkSGi", // Extracted strictly from legacy index.html
      amount: selectedDoctor.fees * 100, // Amount in paise
      currency: "INR",
      name: "MedicarePlus Appointment",
      description: `Consultation with \${selectedDoctor.name}`,
      handler: async function (response: any) {
        try {
          const razorpayPaymentId = response.razorpay_payment_id;
          
          await addDoc(collection(db, 'appointments'), {
            patientId: user?.uid,
            patientName: userProfile?.name || user?.email,
            patientEmail: userProfile?.email || user?.email,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            specialization: selectedDoctor.speciality,
            date,
            time,
            status: 'upcoming',
            fees: selectedDoctor.fees,
            paymentRef: razorpayPaymentId,
            symptoms: symptoms,
            aiAssessment,
            createdAt: new Date().toISOString()
          });

          await emailjs.send('default_service', 'template_smasli7', {
            to_name: userProfile?.name || 'Patient',
            to_email: userProfile?.email || user?.email,
            doctor_name: selectedDoctor.name,
            date: date,
            time: time,
            specialization: selectedDoctor.speciality
          });
          
          setLoading(false);
          alert(`Payment Successful! Reference ID: \${razorpayPaymentId}`);
          navigate('/patient-dashboard');
          
        } catch (err) {
          console.error("Booking Finalization Failed:", err);
          alert("Payment verified, but error confirming booking on server.");
          setLoading(false);
        }
      },
      prefill: {
        name: userProfile?.name || "",
        email: userProfile?.email || user?.email,
        contact: userProfile?.phone || ""
      },
      theme: {
        color: "#00E5FF" // Matches --color-accent-blue
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        console.error('Razorpay payment failed:', response.error);
        alert('Payment Failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      console.error('Razorpay init error:', e);
      alert('Could not open payment gateway. Please ensure you are connected to the internet.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-primary-base) text-white font-sans py-24 px-8 md:px-16 flex justify-center">
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/patient-dashboard')} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black flex items-center gap-3">
              Intelligent <span className="text-gradient">Booking</span>
            </h1>
            <p className="text-(--color-text-muted) font-mono tracking-widest uppercase text-[0.65rem] mt-1">Step {step} of 3</p>
          </div>
        </div>

        {/* Steps Content */}
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: AI Triage Input */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-(--color-accent-blue)/10 flex items-center justify-center text-(--color-accent-blue) border border-(--color-accent-blue)/20 flex-shrink-0">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white mb-1">Describe Your Symptoms</h2>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">Our Groq-powered Llama 3 engine will analyze your condition and instantly route you to the correct specialist.</p>
                  </div>
                </div>

                <form onSubmit={analyzeSymptoms} className="flex flex-col gap-4">
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                    placeholder="e.g., I've been experiencing severe migraines for the past three days accompanied by nausea..."
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-6 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) resize-none transition-colors"
                  />
                  
                  <button type="submit" disabled={loading || !symptoms.trim()} className="w-full md:w-auto self-end py-4 px-8 bg-white text-black rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer">
                    {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Search size={18} /> Run AI Triage</>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Doctor Selection & AI Brief */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                
                {/* AI Brief Banner */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-(--color-accent-purple)/10 to-transparent border border-(--color-accent-purple)/30 flex gap-4 items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-(--color-accent-purple)" />
                  <Activity className="text-(--color-accent-purple) flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 font-mono flex items-center gap-2">Triage Analysis <span className="px-2 py-0.5 rounded bg-(--color-accent-purple)/20 text-[0.6rem]">{specialization}</span></h3>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">{aiAssessment}</p>
                    <p className="text-[0.6rem] text-gray-500 font-mono mt-4 tracking-widest uppercase items-center flex gap-1"><Zap size={10} className="text-yellow-500"/> Powered by Groq Llama 3</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2"><Stethoscope className="text-(--color-accent-blue)"/> Available Specialists</h2>
                  
                  {doctors.length === 0 ? (
                    <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-center">
                      <p className="text-red-400 font-mono text-sm uppercase tracking-widest">No matching specialists found in Firestore database.</p>
                      <p className="text-gray-400 text-xs mt-2">Please register a doctor with the specialization: <span className="text-white font-bold">{specialization}</span></p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map(doc => (
                        <div 
                          key={doc.id} 
                          onClick={() => setSelectedDoctor(doc)}
                          className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 \${selectedDoctor?.id === doc.id ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.02]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                        >
                          <h3 className="font-serif text-lg font-bold">{doc.name}</h3>
                          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-4">{doc.hospital}</p>
                          <div className="flex justify-between items-end border-t border-white/5 pt-4">
                            <div>
                              <p className="text-xs text-gray-500">Experience: <span className="text-gray-300">{doc.experience}</span></p>
                              <p className="text-xs text-gray-500 mt-1">Consultation: <span className="text-(--color-accent-blue) font-bold">₹{doc.fees}</span></p>
                            </div>
                            {selectedDoctor?.id === doc.id && <CheckCircle size={20} className="text-(--color-accent-blue)" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button onClick={() => setStep(3)} disabled={!selectedDoctor} className="w-full md:w-auto self-end py-4 px-8 bg-(--color-accent-blue) text-black rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] mt-4">
                  Proceed to Slots
                </button>
              </motion.div>
            )}

            {/* STEP 3: Slot & Payment */}
            {step === 3 && selectedDoctor && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                
                <div className="flex justify-between items-center p-6 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{selectedDoctor.name}</h3>
                    <p className="text-xs text-(--color-accent-blue) font-mono tracking-widest uppercase">{selectedDoctor.speciality} • ₹{selectedDoctor.fees}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-(--color-accent-blue) flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Select Date</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Select Time Slot</label>
                    <select 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) transition-colors appearance-none"
                    >
                      <option value="" disabled>Choose an available slot</option>
                      {selectedDoctor.availableSlots?.map((slot: string) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-white/10 mt-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400 font-mono tracking-wides">
                    <CreditCard size={20} className="text-green-400" />
                    Secure Razorpay Checkout
                  </div>
                  <button 
                    onClick={confirmBooking} 
                    disabled={loading || !date || !time} 
                    className="w-full md:w-auto py-4 px-10 bg-green-500 text-black rounded-lg font-black text-sm tracking-widest uppercase hover:bg-green-400 transition-colors disabled:opacity-50 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : `Pay ₹${selectedDoctor.fees} & Confirm`}
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
