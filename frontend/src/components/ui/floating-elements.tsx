"use client";

import { motion } from 'framer-motion';

export function FloatingElements() {
  const floatingShapes = [
    { 
      icon: '⏰', 
      delay: 0, 
      duration: 3,
      size: 'text-2xl',
      top: '10%',
      left: '5%'
    },
    { 
      icon: '📊', 
      delay: 0.5, 
      duration: 4,
      size: 'text-xl',
      top: '20%',
      right: '10%'
    },
    { 
      icon: '⚡', 
      delay: 1, 
      duration: 2.5,
      size: 'text-lg',
      bottom: '30%',
      left: '8%'
    },
    { 
      icon: '🎯', 
      delay: 1.5, 
      duration: 3.5,
      size: 'text-xl',
      top: '60%',
      right: '5%'
    },
    { 
      icon: '🚀', 
      delay: 2, 
      duration: 4.5,
      size: 'text-2xl',
      bottom: '10%',
      right: '15%'
    },
    { 
      icon: '💎', 
      delay: 2.5, 
      duration: 3,
      size: 'text-lg',
      top: '40%',
      left: '2%'
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} opacity-20 dark:opacity-10`}
          style={{
            top: shape.top,
            left: shape.left,
            right: shape.right,
            bottom: shape.bottom
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [-5, 5, -5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
        >
          {shape.icon}
        </motion.div>
      ))}
    </div>
  );
}




