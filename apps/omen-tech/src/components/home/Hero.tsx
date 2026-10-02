import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-8 lg:px-10 lg:pt-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:pt-8">
          <p className="fade-up text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
            Nouvelle saison
          </p>
          <h1 className="fade-up fade-up-1 mt-4 text-[42px] font-light leading-[1.04] tracking-tight sm:text-[56px] lg:text-[64px]">
            Le tech qui
            <br />
            <span className="font-medium">compte vraiment.</span>
          </h1>
          <p className="fade-up fade-up-2 mt-5 max-w-[360px] text-[15px] leading-relaxed text-[#555]">
            Smartphones, ordinateurs, audio et accessoires — livrés partout au Togo et au
            Burkina Faso.
          </p>
          <div className="fade-up fade-up-3 mt-8 flex items-center gap-6">
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-2 bg-[#111] px-6 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Voir la boutique
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              to="/catalogue"
              className="text-[13px] font-medium text-[#555] underline underline-offset-4 transition-colors hover:text-[#111]"
            >
              Nouveautés
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Link to="/catalogue" className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
              <img
                src="/tech/hero.jpg"
                alt="Technologie moderne"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <div className="bg-[#fafafa]/95 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[14px] font-medium">Sélection 2026</p>
                  <p className="mt-0.5 text-[13px] text-[#555]">
                    Jusqu&rsquo;à -30% sur une sélection
                  </p>
                </div>
                <span className="bg-[#111] p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
