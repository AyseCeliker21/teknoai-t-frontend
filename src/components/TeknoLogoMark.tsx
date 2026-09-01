export function TeknoLogoMark({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M50 8 L92 82 L8 82 Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      <path d="M60 46 L80 82 L40 82 Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  );
}
