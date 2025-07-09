import React from "react";

interface TechIllustrationProps {
  category?: string;
  className?: string;
}

export function TechIllustration({
  category = "tech",
  className = "",
}: TechIllustrationProps) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center ${className}`}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary/40"
      >
        <path
          d="M60 10L110 40V80L60 110L10 80V40L60 10Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M60 30L90 45V75L60 90L30 75V45L60 30Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="60" cy="60" r="10" fill="currentColor" />
      </svg>
    </div>
  );
}
