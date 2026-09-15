interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "size-7",
    md: "size-9",
    lg: "size-12",
    xl: "size-16",
  }[size];

  const textClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative overflow-hidden rounded-xl bg-white shadow-xs border border-border/60 p-0.5 transition-transform hover:scale-105 ${sizeClasses}`}
      >
        <img
          src="/logo.png"
          alt="UniTop.uz Logo"
          className="size-full object-contain"
          onError={(e) => {
            // Fallback to unitop-logo.jpg if png fails
            const target = e.currentTarget;
            if (target.src !== "/unitop-logo.jpg") {
              target.src = "/unitop-logo.jpg";
            }
          }}
        />
      </div>
      {showText && (
        <span className={`font-extrabold tracking-tight flex items-center ${textClasses}`}>
          <span className="text-navy dark:text-sky-300">UNI</span>
          <span className="text-emerald-600 dark:text-emerald-400">TOP</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 ml-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
            UZ
          </span>
        </span>
      )}
    </div>
  );
}
