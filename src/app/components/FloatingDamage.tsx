import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface FloatingDamageProps {
  damage: number;
  isCritical?: boolean;
  isHealing?: boolean;
  position: { x: number; y: number };
  onComplete: () => void;
}

export function FloatingDamage({ damage, isCritical, isHealing, position, onComplete }: FloatingDamageProps) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: isCritical ? 1.5 : 1,
        y: 0,
        x: 0
      }}
      animate={{ 
        opacity: 0, 
        scale: isCritical ? 2 : 1.2,
        y: -100,
        x: (Math.random() - 0.5) * 40
      }}
      transition={{ 
        duration: 1.5,
        ease: "easeOut"
      }}
      className="absolute pointer-events-none"
      style={{ 
        left: position.x, 
        top: position.y,
        zIndex: 100
      }}
    >
      <div className={`text-4xl font-bold tracking-wider ${
        isHealing ? 'text-green-400' : 
        isCritical ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 
        'text-red-400'
      }`}>
        {isHealing ? '+' : '-'}{damage}
        {isCritical && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            className="ml-2 text-yellow-300"
          >
            💥
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
