'use client';

import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-3 bg-[#FEE2E2] border border-[#EF4444] rounded-lg"
    >
      <p className="text-xs text-[#EF4444]">{message}</p>
    </motion.div>
  );
}

