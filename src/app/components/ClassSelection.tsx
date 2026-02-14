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
    <div className="size-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="max-w-7xl w-full">
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
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedClass(classType.id);
                  setTimeout(() => onSelectClass(classType), 300);
                }}
                className={`group bg-slate-800 border-4 p-4 sm:p-6 transition-all duration-300 ${
                  isSelected
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={isSelected ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 sm:w-24 sm:h-24 border-4 rounded-full flex items-center justify-center mb-4 ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-900/30'
                        : 'border-slate-600 bg-slate-700 group-hover:border-slate-500'
                    }`}
                  >
                    <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${isSelected ? 'text-yellow-400' : 'text-slate-300'}`} />
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
