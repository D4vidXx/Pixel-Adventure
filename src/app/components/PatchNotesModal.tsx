import { X, Calendar, ArrowRight, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PATCH_NOTES } from '../data/patch-notes';

interface PatchNotesModalProps {
    onClose: () => void;
}

export function PatchNotesModal({ onClose }: PatchNotesModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <Terminal className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">System Updates</h2>
                            <p className="text-xs text-slate-400 font-mono">Patch Notes & Changelog</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {PATCH_NOTES.map((note, index) => (
                        <motion.div
                            key={note.version}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 border-l-2 border-slate-800"
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-slate-900 ${index === 0 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} />

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${index === 0 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                                        v{note.version}
                                    </span>
                                    {index === 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="px-2 py-1 rounded text-xs font-bold bg-red-600/30 text-red-300 border border-red-500/50"
                                        >
                                            🆕 NEW
                                        </motion.span>
                                    )}
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {note.date}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-200 mb-2">{note.title}</h3>
                                <p className="text-slate-400 text-sm italic">{note.description}</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {note.sections.map((section, sIndex) => (
                                    <div key={sIndex} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                                            {section.title}
                                        </h4>
                                        <ul className="space-y-2">
                                            {section.items.map((item, iIndex) => (
                                                <li key={iIndex} className="text-sm text-slate-400 flex items-start gap-2 leading-relaxed">
                                                    <span className="mt-1.5 w-1 h-1 bg-slate-500 rounded-full flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-center">
                    <p className="text-[10px] text-slate-600 font-mono uppercase">End of Log</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
