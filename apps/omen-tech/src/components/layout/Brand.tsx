import { Link } from "react-router-dom";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 leading-none ${className}`}>
      <img
        src="/img/logo-omen-tech.jpg"
        alt="oMen Tech"
        className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
      />
      <span className="font-display text-[20px] font-semibold tracking-[-0.02em] text-[#27272a] sm:text-[23px]">
        oMen<span className="font-normal text-[#71717a]"> Tech</span>
      </span>
    </Link>
  );
}
