import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { CLASSES, ClassType } from '../data/classes';

interface ClassSelectionProps {
  onSelectClass: (classType: ClassType) => void;
  onBack: () => void;
}

export function ClassSelection({ onSelectClass, onBack }: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  return (
    <div className="size-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-auto relative">
      {/* Animated Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.13, 0.08],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-yellow-400/10 rounded-full blur-[120px] z-0"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] z-0"
      />
      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-5xl text-slate-100 mb-3 tracking-wider uppercase">
            Choose Your Class
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg">
            Select a class to view available heroes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {CLASSES.map((classType, index) => {
            const Icon = classType.icon;
            const isSelected = selectedClass === classType.id;
            return (
              <motion.button
                key={classType.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.07, y: -10 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedClass(classType.id);
                  setTimeout(() => onSelectClass(classType), 300);
                }}
                className={`group bg-slate-800/70 border-4 p-4 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden
                  ${isSelected ? 'border-yellow-400 bg-yellow-900/30 shadow-yellow-400/20' : 'border-slate-700 hover:border-yellow-400/60'}
                `}
              >
                {/* Animated border glow */}
                <motion.div
                  animate={isSelected ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border-4 border-yellow-400/40 pointer-events-none z-0"
                  style={{ filter: 'blur(6px)' }}
                />
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    animate={isSelected ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 sm:w-24 sm:h-24 border-4 rounded-full flex items-center justify-center mb-4
                      ${isSelected ? 'border-yellow-400 bg-yellow-900/40 shadow-yellow-400/20 shadow-lg' : 'border-slate-600 bg-slate-700 group-hover:border-yellow-400/60'}
                    `}
                  >
                    <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${isSelected ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]' : 'text-slate-300'}`} />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl text-slate-100 tracking-wider uppercase mb-3">
                    {classType.name}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-4">
                    {classType.description}
                  </p>
                  <div className="w-full pt-4 border-t border-slate-700">
                    <span className="text-slate-300 text-sm tracking-wide uppercase">
                      Click to Continue →
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border-2 border-slate-600 hover:border-slate-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="tracking-wide uppercase">Back to Menu</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
