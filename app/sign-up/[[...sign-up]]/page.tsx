"use client"
import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';
import { motion } from 'framer-motion'; // For advanced animations

export default function Page() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const card = document.getElementById('signin-card');
      if (card) {
        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth: width, innerHeight: height } = window;

        // Calculate the rotation angle based on mouse position
        const rotationX = (mouseY / height - 0.5) * -20;
        const rotationY = (mouseX / width - 0.5) * 20;

        card.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Nexus light effect from below */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full bg-blue-600 blur-3xl opacity-50 transform -translate-x-1/2"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Rotating Nexus effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[800px] h-[800px] rounded-full border border-blue-600 blur-3xl opacity-50 transform -translate-x-1/2 rotate-45"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        id="signin-card"
        className="relative p-8  rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SignUp  />
      </motion.div>

      {/* Complex backgroclund animations */}
      <motion.div
        className="absolute inset-0 z-[-1] bg-gradient-to-br from-blue-900 via-black to-purple-900 opacity-10"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
