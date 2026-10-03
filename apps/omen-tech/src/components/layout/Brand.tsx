import { Link } from "react-router-dom";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="oMen Tech — accueil" className={`group inline-flex items-center leading-none ${className}`}>
      <img
        src="/img/logo-omen-tech.jpg"
        alt="oMen Tech"
        className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
      />
    </Link>
  );
}
