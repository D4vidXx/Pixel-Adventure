import { motion } from 'motion/react';

export function AuroraShootingStar() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>
        {`@keyframes aurora-star {
  0% { transform: translate(-20%, -10%) rotate(12deg); opacity: 0; }
  8% { opacity: 0.45; }
  28% { opacity: 0.35; }
  45% { opacity: 0; }
  100% { transform: translate(130%, 70%) rotate(12deg); opacity: 0; }
}
.aurora-star {
  position: absolute;
  top: 12%;
  left: -20%;
  width: 160px;
  height: 10px;
  animation: aurora-star 7.5s linear infinite;
}
.aurora-trail {
  position: absolute;
  right: 10px;
  top: 50%;
  width: 140px;
  height: 2px;
  transform: translateY(-50%);
  background: linear-gradient(to right, rgba(255,255,255,0.0), rgba(255,255,255,0.22), rgba(255,255,255,0.0));
  filter: blur(0.4px);
  opacity: 0.35;
}
.aurora-dot {
  position: absolute;
  right: 4px;
  top: 50%;
  width: 4px;
  height: 4px;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 0 6px rgba(255,255,255,0.45);
}
`}
      </style>
      <motion.div
        className="aurora-star"
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="aurora-trail" />
        <div className="aurora-dot" />
      </motion.div>
    </div>
  );
}
