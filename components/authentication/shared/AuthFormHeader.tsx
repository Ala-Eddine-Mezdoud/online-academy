'use client';

interface AuthFormHeaderProps {
  title: string;
  description: string;
}

export default function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <div className="mb-6">
      <h2 
        className="text-xl lg:text-2xl font-bold text-[#30363A] mb-2 text-center" 
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        {title}
      </h2>
      <p className="text-sm text-[#9AA2AA]">
        {description}
      </p>
    </div>
  );
}


