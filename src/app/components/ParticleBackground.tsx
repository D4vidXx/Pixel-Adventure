import { motion } from 'motion/react';

export function ParticleBackground({ stage = 1 }: { stage?: number }) {
  const isStage1 = stage === 1;

  const getParticleColor = (i: number) => {
    if (isStage1) {
      // Goblin/Forest Theme: Green, Emerald, Yellowish
      return i % 3 === 0 ? 'bg-green-500/20' : i % 3 === 1 ? 'bg-emerald-600/20' : 'bg-yellow-100/10';
    } else {
      // Shadow Realm Theme: Purple, Indigo, Dark
      return i % 3 === 0 ? 'bg-purple-600/30' : i % 3 === 1 ? 'bg-indigo-900/40' : 'bg-fuchsia-900/20';
    }
  };

  const getParticleDrift = () => {
    if (isStage1) return (Math.random() - 0.5) * 50; // Windy forest
    return (Math.random() - 0.5) * 20; // Falling/rising shadows
  };

  const getParticleDuration = () => {
    if (isStage1) return Math.random() * 10 + 10;
    return Math.random() * 20 + 15; // Slower shadows
  };

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: getParticleDuration(),
    delay: Math.random() * 10,
    color: getParticleColor(i),
    drift: getParticleDrift(),
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 ${isStage1 ? 'bg-emerald-950/20' : 'bg-purple-950/10'}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} blur-[1px]`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, isStage1 ? -100 : -200, 0],
            x: [0, particle.drift, 0],
            opacity: [0, isStage1 ? 0.4 : 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

