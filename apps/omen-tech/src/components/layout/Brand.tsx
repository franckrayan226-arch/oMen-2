import { Link } from "react-router-dom";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-[20px] font-bold leading-none tracking-[-0.03em]">
        oMen
      </span>
      <span className="mb-[1px] h-[7px] w-[7px] shrink-0 self-end bg-accent transition-transform duration-200 group-hover:scale-125" />
      <span className="mb-[1px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.24em] text-ink-3">
        Tech
      </span>
    </Link>
  );
}
