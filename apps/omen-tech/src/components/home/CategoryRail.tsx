import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    name: "Smartphones",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970071/omen-tech/xbnxm1d60jmckcxlnxiy.jpg",
  },
  {
    name: "Ordinateurs",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970063/omen-tech/qk1te1akhbgpziqfv6kb.jpg",
  },
  {
    name: "Audio",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970067/omen-tech/cm8cj6jxylswg0h6dakf.jpg",
  },
  {
    name: "Tablettes",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970069/omen-tech/ibgj8fdmt1bgaiwregrg.jpg",
  },
  {
    name: "Montres",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790971055/omen-tech/tmzlspjbiwgv1famj8mp.jpg",
  },
  {
    name: "Accessoires",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790971060/omen-tech/i5esshqogrqveqgqau3a.jpg",
  },
];

export function CategoryRail() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10 lg:py-20">
      <h2 className="text-[26px] font-bold uppercase tracking-[-0.02em] lg:text-[34px]">
        Toutes les cat&eacute;gories
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            to={`/catalogue?cat=${encodeURIComponent(c.name)}`}
            className="group relative aspect-[3/4] overflow-hidden bg-[#eee]"
          >
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="font-bungee absolute bottom-3 left-3 text-[13px] leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
