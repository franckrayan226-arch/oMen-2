import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    name: "Smartphones",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965820/omen-tech/rxm3uv7izty4rzbsnyfq.jpg",
  },
  {
    name: "Ordinateurs",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965823/omen-tech/s9rm2qghftuc89fb1gkf.jpg",
  },
  {
    name: "Audio",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965816/omen-tech/gutjf5iekx0j1bkon5si.jpg",
  },
  {
    name: "Tablettes",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965829/omen-tech/gzyqkmujncmszyohqy6m.jpg",
  },
  {
    name: "Montres",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965830/omen-tech/jedqnnvhsla4ij60ej3i.jpg",
  },
  {
    name: "Accessoires",
    image:
      "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790965821/omen-tech/ypxsy0692nnbnrfqw6yg.jpg",
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
            <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
