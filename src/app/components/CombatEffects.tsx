import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  isCritical?: boolean;
}

interface CombatEffectsProps {
  children: React.ReactNode;
}

export function CombatEffects({ children }: CombatEffectsProps) {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  return (
    <div className="relative">
      {children}
      
      <AnimatePresence>
        {floatingTexts.map((text) => (
          <motion.div
            key={text.id}
            initial={{ opacity: 1, y: 0, scale: text.isCritical ? 1.5 : 1 }}
            animate={{ opacity: 0, y: -80, scale: text.isCritical ? 2 : 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => {
              setFloatingTexts(prev => prev.filter(t => t.id !== text.id));
            }}
            className="absolute pointer-events-none z-50"
            style={{
              left: text.x,
              top: text.y,
              color: text.color,
              fontSize: text.isCritical ? '3rem' : '2rem',
              fontWeight: 'bold',
              textShadow: text.isCritical ? '0 0 20px currentColor' : '0 0 10px currentColor',
            }}
          >
            {text.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
