'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AuthHeroSectionProps {
  title: string;
  description: string;
  illustrationSrc: string;
  illustrationAlt: string;
  order?: 'left' | 'right';
}

export default function AuthHeroSection({
  title,
  description,
  illustrationSrc,
  illustrationAlt,
  order = 'right',
}: AuthHeroSectionProps) {
  const orderClass = order === 'left' ? 'order-1 lg:order-1' : 'order-2 lg:order-2';
  const animationDirection = order === 'left' ? -20 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: animationDirection }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`hidden lg:flex flex-col items-center justify-center space-y-6 ${orderClass}`}
    >
      <div className="w-full max-w-[80%] text-center lg:text-left">
        <h1 
          className="text-3xl lg:text-[36px] font-bold text-[#19B7FF] mb-2" 
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {title}
        </h1>
        <p className="text-base lg:text-lg text-[#30363A]">
          {description}
        </p>
      </div>
      <div className="w-full max-w-[75%] aspect-square relative">
        <Image
          src={illustrationSrc}
          alt={illustrationAlt}
          fill
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}

