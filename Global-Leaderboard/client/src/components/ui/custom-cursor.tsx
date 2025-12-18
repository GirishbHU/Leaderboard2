import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Check for hoverable elements
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName === 'BUTTON' || 
                          target.tagName === 'A' ||
                          target.closest('a') !== null ||
                          target.closest('button') !== null;
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{
        x: position.x - 12,
        y: position.y - 12,
        scale: isHovering ? 1.5 : 1, // Increased scale on hover
        opacity: isHovering ? 0.8 : 0.5 // Increased opacity for "pronounced" effect
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.1
      }}
    >
      {/* Pronounced glow following the cursor */}
      <div className="w-6 h-6 rounded-full bg-primary/60 blur-md shadow-[0_0_15px_rgba(var(--primary),0.6)]" />
    </motion.div>
  );
}
