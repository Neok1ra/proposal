```typescript
import React, { useEffect, useState, useRef, Suspense, Component, ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Video from 'next/video';
import { motion, Variants } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Particles, { type Engine, type ISourceOptions } from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Confetti from 'react-confetti';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import MouseTrail from 'react-mouse-trail';
import dynamic from 'next/dynamic';

// Lazy-load Canvas
const DynamicCanvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false });

// Error Boundary
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-center text-red-500">Failed to load 3D ring. Please refresh.</div>;
    }
    return this.props.children;
  }
}

// 3D Ring Component
function RingModel() {
  try {
    // Model: Engagement Ring Box with Ring - low poly by Karolina Renkiewicz
    // Source: https://sketchfab.com/3d-models/engagement-ring-box-with-ring-low-poly-973ec41bcc9d4bf883a566b53e24b4b6
    const { scene } = useGLTF('/models/engagement-ring.glb');
    return <primitive object={scene} scale={[0.3, 0.3, 0.3]} rotation={[0, 0.01, 0]} />;
  } catch {
    return <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color="silver" /></mesh>;
  }
}

// Particle Configuration
const particlesInit = async (engine: Engine) => {
  await loadFull(engine);
};

const particlesOptions: ISourceOptions = {
  particles: {
    number: { value: 30, density: { enable: true, value_area: 1000 } }, // Optimized
    shape: { type: 'image', image: { src: '/heart.png', width: 32, height: 32 } }, // Flaticon heart_15818582
    opacity: { value: 0.8, random: true },
    size: { value: 15, random: true },
    move: { enable: true, speed: 2, direction: 'top', out_mode: 'out' },
  },
  interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
};

// Animation Variants
const sectionVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

export default function Proposal() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio play
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {
        setToastOpen(true);
      });
    }
  }, [isMuted]);

  // Stop confetti
  useEffect(() => {
    if (answer === 'yes') {
      const timer = setTimeout(() => setAnswer(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [answer]);

  return (
    <ToastProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-pink-900 text-white' : 'bg-gradient-to-b from-red-900 to-pink-200 text-white'} font-sans relative`}>
        <Head>
          <title>{t('title')}</title>
          <meta name="description" content={t('description')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content={t('title')} />
          <meta property="og:description" content={t('description')} />
          <meta property="og:image" content="/og-image.jpg" />
          <meta property="og:type" content="website" />
          <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" as="style" />
        </Head>

        {/* Mouse Trail */}
        <MouseTrail
          imageSrc="/heart.png" // Flaticon heart_15818582
          trailCount={10}
          size={20}
          life={1000}
          className="pointer-events-none"
        />

        {/* Video Background */}
        <div className="absolute inset-0 opacity-30 hidden md:block">
          <Video
            src="/romantic-video.mp4" // Falling petals video: https://youtu.be/Ycj6IsezjqQ
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Particles */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Audio */}
        <audio ref={audioRef} loop className="hidden">
          <source src="/romantic-music.mp3" type="audio/mpeg" /> {/* Song of Serenity by Lite Saturation */}
        </audio>

        {/* Toast */}
        <Toast open={toastOpen} onOpenChange={setToastOpen}>
          <ToastTitle>Audio Issue</ToastTitle>
          <ToastDescription>Click "Play Music" to enable audio.</ToastDescription>
        </Toast>
        <ToastViewport />

        {/* Theme and Language Controls */}
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-transparent border border-white px-3 py-1"
            aria-label={t('themeToggleAria')}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </Button>
          <Select onValueChange={(value) => i18n.changeLanguage(value)} defaultValue={i18n.language}>
            <SelectTrigger className="w-24 bg-transparent border-white">
              <SelectValue placeholder={t('languagePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('languageEn')}</SelectItem>
              <SelectItem value="de">{t('languageDe')}</SelectItem>
              <SelectItem value="bn">{t('languageBn')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex flex-col justify-center items-center text-center p-4 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          aria-label={t('heroAria')}
        >
          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] text-pink-200 mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-md md:text-xl max-w-2xl mx-auto mb-8 font-light">
            {t('heroText')}
          </p>
          <motion.p
            className="text-sm md:text-lg max-w-2xl mx-auto mb-4 font-light italic hover:text-yellow-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('heroGerman')}
          </motion.p>
          <motion.p
            className="text-sm md:text-lg max-w-2xl mx-auto mb-8 font-light italic hover:text-yellow-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t('heroBengali')}
          </motion.p>
        </motion.section>

        {/* Love Letter Section */}
        <motion.section
          className="py-12 px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label={t('letterAria')}
        >
          <h2 className="text-2xl md:text-4xl font-['Playfair_Display'] text-center mb-8">{t('letterTitle')}</h2>
          <div className="max-w-3xl mx-auto bg-opacity-80 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <TypeAnimation
              sequence={[t('letterText'), 1000]}
              wrapper="p"
              cursor={true}
              className="text-md md:text-xl font-light italic text-center text-black dark:text-white"
            />
          </div>
        </motion.section>

        {/* Poem Section */}
        <motion.section
          className="py-12 px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label={t('poemAria')}
        >
          <h2 className="text-2xl md:text-4xl font-['Playfair_Display'] text-center mb-8">{t('poemTitle')}</h2>
          <p className="text-md md:text-xl max-w-3xl mx-auto font-light italic text-center hover:text-yellow-300 transition-colors">
            {t('poemText')}
          </p>
          <p className="text-sm md:text-lg max-w-3xl mx-auto mt-4 font-light italic text-center hover:text-yellow-300 transition-colors">
            {t('poemGerman')}
          </p>
          <p className="text-sm md:text-lg max-w-3xl mx-auto mt-4 font-light italic text-center hover:text-yellow-300 transition-colors">
            {t('poemBengali')}
          </p>
        </motion.section>

        {/* Gallery Section */}
        <motion.section
          className="py-12 px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label={t('galleryAria')}
        >
          <h2 className="text-2xl md:text-4xl font-['Playfair_Display'] text-center mb-8">{t('galleryTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={`/memories/memory-${i}.jpg`}
                  width={400}
                  height={300}
                  alt={t('galleryImageAlt', { number: i })}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          className="py-12 px-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-label={t('timelineAria')}
        >
          <h2 className="text-2xl md:text-4xl font-['Playfair_Display'] text-center mb-8">{t('timelineTitle')}</h2>
          <ul className="max-w-2xl mx-auto space-y-6">
            <motion.li variants={sectionVariants} viewport={{ once: true }}>
              <p className="text-md md:text-lg"><span className="font-bold">{t('timeline1Date')}:</span> {t('timeline1Text')}</p>
            </motion.li>
            <motion.li variants={sectionVariants} viewport={{ once: true }}>
              <p className="text-md md:text-lg"><span className="font-bold">{t('timeline2Date')}:</span> {t('timeline2Text')}</p>
            </motion.li>
            <motion.li variants={sectionVariants} viewport={{ once: true }}>
              <p className="text-md md:text-lg"><span className="font-bold">{t('timeline3Date')}:</span> {t('timeline3Text')}</p>
            </motion.li>
            <motion.li variants={sectionVariants} viewport={{ once: true }}>
              <p className="text-md md:text-lg"><span className="font-bold">{t('timeline4Date')}:</span> {t('timeline4Text')}</p>
            </motion.li>
          </ul>
        </motion.section>

        {/* 3D Ring Section */}
        <motion.section
          className="py-12 flex justify-center items-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="w-full h-80 max-w-xl">
            <Suspense fallback={<div className="text-center">Loading 3D proposal ring...</div>}>
              <CanvasErrorBoundary>
                <DynamicCanvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <RingModel />
                  <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
                </DynamicCanvas>
              </CanvasErrorBoundary>
            </Suspense>
          </div>
        </motion.section>

        {/* Proposal Button */}
        <motion.section
          className="py-12 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-yellow-500 text-black text-md md:text-lg px-6 py-3 rounded-full hover:bg-yellow-600 transition"
            aria-label={t('proposalButtonAria')}
          >
            {t('proposalButton')}
          </Button>
        </motion.section>

        {/* Proposal Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-pink-100 dark:bg-gray-800 text-black dark:text-white max-w-md">
            {answer === 'yes' && <Confetti recycle={false} numberOfPieces={100} />}
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-['Playfair_Display'] text-center">
                {t('modalTitle')}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => setAnswer('yes')}
                className="bg-green-500 text-white px-4 py-2"
                aria-label={t('modalYesAria')}
              >
                {t('modalYes')}
              </Button>
              <Button
                onClick={() => setAnswer('no')}
                className="bg-red-500 text-white px-4 py-2"
                aria-label={t('modalNoAria')}
              >
                {t('modalNo')}
              </Button>
            </div>
            {answer === 'yes' && (
              <p className="mt-4 text-md md:text-lg text-center">{t('modalYesResponse')}</p>
            )}
            {answer === 'no' && (
              <p className="mt-4 text-md md:text-lg text-center">{t('modalNoResponse')}</p>
            )}
          </DialogContent>
        </Dialog>

        {/* Footer with Attribution */}
        <footer className="py-8 text-center">
          <p className="text-md md:text-lg font-light">
            {t('footerText')} <span className="animate-pulse text-red-500">♥</span> {t('footerBy')}
          </p>
          <Button
            onClick={() => setIsMuted(!isMuted)}
            className="mt-4 bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black dark:hover:bg-gray-700"
            aria-label={isMuted ? t('playMusicAria') : t('muteMusicAria')}
          >
            {isMuted ? t('playMusic') : t('muteMusic')}
          </Button>
          <p className="text-xs mt-4">
            Music: <a href="https://freemusicarchive.org/music/Lite_Saturation/Song_of_Serenity" target="_blank" rel="noopener noreferrer">Song of Serenity by Lite Saturation</a> (CC BY-ND 4.0). 
            Icon: <a href="https://www.flaticon.com/free-icon/heart_15818582" target="_blank" rel="noopener noreferrer">Heart by tyche fairy - Flaticon</a>.
          </p>
        </footer>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>
    </ToastProvider>
  );
}
```
