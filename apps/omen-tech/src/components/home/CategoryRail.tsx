import { Link } from "react-router-dom";
import { useCategories, type CategoryItem } from "../../hooks/useCategories";

const SPAN = "col-span-2 md:col-span-4";

// Ziggurat : rangs décalés d'une demi-brique, piloté par l'index (pas par le nom)
// pour que l'ordre reste cohérent quel que soit le contenu venu du backend.
function stagger(i: number) {
  const mobile = i % 4 === 2 ? "col-start-2 md:col-start-auto" : "";
  const md = i % 6 === 3 ? "md:col-start-3" : "";
  return `${mobile} ${md}`.trim();
}

function Brick({ c, index }: { c: CategoryItem; index: number }) {
  return (
    <Link
      to={`/catalogue?cat=${encodeURIComponent(c.name)}`}
      className={`${SPAN} ${stagger(index)} group block rounded-lg border border-[#e5e5e5] bg-white p-1.5 transition duration-300 hover:border-[#111] active:scale-[0.985]`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#eee] md:aspect-[16/9]">
        {c.image ? (
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="relative flex items-center justify-between gap-1.5 overflow-hidden px-0.5 pb-0.5 pt-2">
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-[#111] transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
        <span className="relative font-bungee truncate text-[11px] leading-none text-[#111] transition-colors duration-300 group-hover:text-white md:text-[13px]">
          {c.name}
        </span>
        <span
          aria-hidden
          className="relative shrink-0 text-[13px] leading-none text-[#999] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}

function SkeletonBrick({ index }: { index: number }) {
  return (
    <div className={`${SPAN} ${stagger(index)} rounded-lg border border-[#e5e5e5] bg-white p-1.5`} aria-hidden>
      <div className="aspect-[4/3] animate-pulse rounded-md bg-[#eee] md:aspect-[16/9]" />
      <div className="mb-0.5 mt-2 h-3 w-20 animate-pulse rounded bg-[#eee]" />
    </div>
  );
}

export function CategoryRail() {
  const { categories, loading } = useCategories();

  if (!loading && categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10 lg:py-20">
      <h2 className="text-[26px] font-bold uppercase tracking-[-0.02em] lg:text-[34px]">
        Toutes les cat&eacute;gories
      </h2>

      <div className="mt-8 grid grid-cols-5 gap-3 md:[grid-template-columns:repeat(14,minmax(0,1fr))]">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonBrick key={i} index={i} />)
          : categories.map((c, i) => <Brick key={c.id} c={c} index={i} />)}
      </div>
    </section>
  );
}
