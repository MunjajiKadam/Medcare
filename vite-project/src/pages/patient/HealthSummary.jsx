import React, { useEffect, useState } from 'react';
import { healthRecordAPI, prescriptionAPI, consultationNotesAPI, diagnosisAPI } from '../../api/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
    Clipboard,
    FileText,
    Activity,
    AlertCircle,
    Calendar,
    Download,
    User,
    Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const HealthSummary = () => {
    const [data, setData] = useState({
        records: [],
        prescriptions: [],
        notes: [],
        diagnoses: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [records, prescriptions, notes, diagnoses] = await Promise.all([
                    healthRecordAPI.getHealthRecords(),
                    prescriptionAPI.getPrescriptions(),
                    consultationNotesAPI.getConsultationNotes(),
                    diagnosisAPI.getDiagnoses()
                ]);

                setData({
                    records: records.data.records || [],
                    prescriptions: prescriptions.data.prescriptions || [],
                    notes: notes.data.notes || [],
                    diagnoses: diagnoses.data.diagnoses || []
                });
            } catch (error) {
                console.error('Error fetching health summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background dark:bg-gray-900">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-dark dark:text-white flex items-center gap-3">
                            <Heart className="text-red-500" fill="currentColor" /> Digital Health Passport
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Your consolidated medical history and health summary.</p>
                    </div>
                    <button className="btn btn-primary flex items-center gap-2">
                        <Download size={18} /> Export PDF
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Diagnoses */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-accent/5 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 font-bold dark:text-white">
                                <AlertCircle className="text-accent" size={20} /> Recent Diagnoses
                            </div>
                            <div className="p-6">
                                {data.diagnoses.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.diagnoses.map((item, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-l-4 border-accent">
                                                <h4 className="font-bold dark:text-white text-lg">{item.diagnosis}</h4>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.severity === 'severe' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {item.severity.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 text-center py-4">No diagnoses found.</p>}
                            </div>
                        </section>

                        {/* Prescriptions */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-green-500/5 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 font-bold dark:text-white">
                                <Clipboard className="text-green-500" size={20} /> Active Prescriptions
                            </div>
                            <div className="p-6">
                                {data.prescriptions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.prescriptions.map((item, idx) => (
                                            <div key={idx} className="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition">
                                                <h4 className="font-bold dark:text-white">{item.medications}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.dosage} - {item.duration}</p>
                                                <div className="mt-3 text-xs text-gray-400">Prescribed on {new Date(item.created_at).toLocaleDateString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 text-center py-4">No prescriptions found.</p>}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Stats & Records */}
                    <div className="space-y-8">
                        <section className="bg-gradient-to-br from-accent to-secondary p-6 rounded-2xl text-white shadow-xl shadow-accent/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <User size={24} />
                                </div>
                                <h3 className="font-bold text-xl">Quick Vitals</h3>
                            </div>
                            <div className="space-y-4">
                                {data.records.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-2 last:border-0">
                                        <span className="text-white/80">{item.record_type}</span>
                                        <span className="font-bold text-lg">{item.record_value}</span>
                                    </div>
                                ))}
                                {data.records.length === 0 && <p className="text-white/60 text-center text-sm">No vitals recorded yet.</p>}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-blue-500/5 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 font-bold dark:text-white">
                                <FileText className="text-blue-500" size={20} /> Consultation Notes
                            </div>
                            <div className="p-6">
                                {data.notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.notes.map((item, idx) => (
                                            <div key={idx} className="text-sm border-b border-gray-50 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                                <p className="font-bold dark:text-white mb-1 line-clamp-2">{item.notes}</p>
                                                <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-gray-500 text-center py-4 text-sm">No notes found.</p>}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HealthSummary;
