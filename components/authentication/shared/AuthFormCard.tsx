'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthFormCardProps {
  children: ReactNode;
  order?: 'left' | 'right';
}

export default function AuthFormCard({ children, order = 'left' }: AuthFormCardProps) {
  const orderClass = order === 'left' ? 'order-1 lg:order-1' : 'order-1 lg:order-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${orderClass}`}
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-6 lg:p-8">
        {children}
      </div>
    </motion.div>
  );
}


