'use client';

import { AnimatePresence } from 'framer-motion';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';

interface AuthMessagesProps {
  error: string | null;
  success: boolean;
  successMessage: string;
}

export default function AuthMessages({ error, success, successMessage }: AuthMessagesProps) {
  return (
    <AnimatePresence mode="wait">
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={successMessage} />}
    </AnimatePresence>
  );
}


