import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Stethoscope, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const symptomsMap = {
    'headache': 'General Physician',
    'fever': 'General Physician',
    'chest pain': 'Cardiologist',
    'heart': 'Cardiologist',
    'skin': 'Dermatologist',
    'rash': 'Dermatologist',
    'tooth': 'Dentist',
    'bone': 'Orthopedic',
    'joint': 'Orthopedic',
    'stomach': 'Gastroenterologist',
    'digestion': 'Gastroenterologist',
    'eye': 'Ophthalmologist',
    'vision': 'Ophthalmologist',
    'ear': 'ENT Specialist',
    'nose': 'ENT Specialist',
    'throat': 'ENT Specialist',
    'stress': 'Psychiatrist',
    'anxiety': 'Psychiatrist',
    'mental': 'Psychiatrist'
};

const TriageAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [symptom, setSymptom] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const navigate = useNavigate();

    const handleTriage = () => {
        const input = symptom.toLowerCase();
        let foundSpecialty = 'General Physician';

        for (const [key, value] of Object.entries(symptomsMap)) {
            if (input.includes(key)) {
                foundSpecialty = value;
                break;
            }
        }

        setRecommendation(foundSpecialty);
        setStep(2);
    };

    const reset = () => {
        setStep(1);
        setSymptom('');
        setRecommendation(null);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-accent/20 overflow-hidden"
                    >
                        <div className="bg-accent p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-white">
                                <Stethoscope size={20} />
                                <span className="font-bold">Smart Triage Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Tell me your symptoms, and I'll suggest the right specialist for you.
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                                            placeholder="e.g. I have a sharp headache..."
                                            value={symptom}
                                            onChange={(e) => setSymptom(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleTriage()}
                                        />
                                        <button
                                            onClick={handleTriage}
                                            className="absolute right-2 top-2 p-1.5 bg-accent text-white rounded-lg hover:opacity-90 transition"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4 text-center"
                                >
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent mb-2">
                                        <Stethoscope size={32} />
                                    </div>
                                    <h3 className="font-bold text-lg">Recommendation</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Based on your symptoms, we recommend seeing a:
                                    </p>
                                    <div className="py-2 px-4 bg-accent/10 text-accent font-bold rounded-lg inline-block">
                                        {recommendation}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <button
                                            onClick={() => navigate(`/patient/browse-doctors?specialization=${recommendation}`)}
                                            className="w-full py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition active:scale-95"
                                        >
                                            Find {recommendation} Doctors <ChevronRight size={16} />
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="text-sm text-gray-500 hover:text-accent transition"
                                        >
                                            Try different symptoms
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-accent text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-accent/40 transition-shadow"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default TriageAssistant;
