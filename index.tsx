import React, { useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Confetti from 'react-confetti';
import { useState } from 'react';
import styles from './styles.module.css';

// 3D Ring Component
function RingModel() {
  const { scene } = useGLTF('/models/ring.glb'); // Placeholder: Add actual ring model path
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} />;
}

// Particle Configuration
const particlesInit = async (engine: any) => {
  await loadFull(engine);
};

const particlesOptions = {
  particles: {
    number: { value: 50, density: { enable: true, value_area: 800 } },
    shape: { type: 'image', image: { src: '/heart.png', width: 32, height: 32 } },
    opacity: { value: 0.7, random: true },
    size: { value: 20, random: true },
    move: { enable: true, speed: 2, direction: 'top', out_mode: 'out' },
  },
  interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
};

export default function Proposal() {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-pink-200 text-white font-sans">
      <Head>
        <title>Will You Marry Me, Khushi?</title>
        <meta name="description" content="A heartfelt marriage proposal for Khushi from Krishn" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Particles */}
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0" />

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] text-pink-200 mb-6">
          To My Dearest Khushi
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 font-light">
          From the moment we met, you've filled my life with joy and love. Every day with you is a dream come true.
        </p>
        <p className="text-md md:text-xl max-w-2xl mx-auto mb-4 font-light italic">
          German: Seit dem Tag, an dem wir uns trafen, bist du mein Licht und meine Liebe, Khushi. (Since the day we met, you are my light and my love, Khushi.)
        </p>
        <p className="text-md md:text-xl max-w-2xl mx-auto mb-8 font-light italic">
          Bengali: যেদিন থেকে আমরা মিলিত হয়েছি, তুমি আমার জীবনকে আনন্দ ও ভালোবাসায় ভরিয়ে দিয়েছ, খুশি। (Since the day we met, you have filled my life with joy and love, Khushi.)
        </p>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-center mb-8">Our Memories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`https://source.unsplash.com/random/400x300?couple=${i}`}
                alt={`Memory ${i}`}
                className="w-full h-64 object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3D Ring Section */}
      <motion.section
        className="py-16 flex justify-center items-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full h-96 max-w-2xl">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <RingModel />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </motion.section>

      {/* Proposal Button */}
      <motion.section
        className="py-16 text-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gold-500 text-black text-lg px-8 py-4 rounded-full hover:bg-gold-600 transition"
        >
          A Special Question
        </Button>
      </motion.section>

      {/* Proposal Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-pink-100 text-black">
          {answer === 'yes' && <Confetti />}
          <DialogHeader>
            <DialogTitle className="text-3xl font-['Playfair_Display'] text-center">
              Will You Marry Me, Khushi?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setAnswer('yes')}
              className="bg-green-500 text-white px-6 py-3"
            >
              Yes
            </Button>
            <Button
              onClick={() => setAnswer('no')}
              className="bg-red-500 text-white px-6 py-3"
            >
              No
            </Button>
          </div>
          {answer === 'yes' && (
            <p className="mt-4 text-lg text-center">My heart is yours forever, Khushi!</p>
          )}
          {answer === 'no' && (
            <p className="mt-4 text-lg text-center">Let's talk about it, my love!</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-lg font-light">
          Made with <span className="animate-pulse text-red-500">♥</span> by Krishn
        </p>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        .bg-gold-500 {
          background-color: #FFD700;
        }
        .bg-gold-600 {
          background-color: #E6C200;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
