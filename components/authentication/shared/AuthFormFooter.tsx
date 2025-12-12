'use client';

interface AuthFormFooterProps {
  prompt: string;
  linkText: string;
  linkHref: string;
}

export default function AuthFormFooter({ prompt, linkText, linkHref }: AuthFormFooterProps) {
  return (
    <div className="mt-4 text-center">
      <p className="text-xs text-[#9AA2AA]">
        {prompt}{' '}
        <a
          href={linkHref}
          className="text-[#19B7FF] hover:text-[#0C86D8] font-medium transition-colors"
        >
          {linkText}
        </a>
      </p>
    </div>
  );
}


