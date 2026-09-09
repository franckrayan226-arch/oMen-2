import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="mx-auto mt-16 sm:mt-24 max-w-7xl px-3 sm:px-6 mb-12">
      <Reveal>
        <div className="glass-deep relative overflow-hidden rounded-3xl p-8 text-center sm:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1d4ed8]/20 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#1d4ed8]/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] sm:text-[300px] font-black text-white/[0.02] select-none pointer-events-none" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
            O
          </div>

          <div className="relative z-10 mx-auto max-w-lg">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#1d4ed8]">
              Newsletter
            </p>
            <h2 className="mt-3 text-[28px] sm:text-[40px] text-white leading-tight" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontWeight: 800 }}>
              Reste dans<br/>le game.
            </h2>
            <p className="mt-3 text-[13px] sm:text-[15px] text-white/60 leading-relaxed">
              Nouvelles paires, promos exclusives, drops limités — directement dans ta boîte mail. Sans spam, promis.
            </p>

            {submitted ? (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-full border border-green-400/25 bg-green-500/15 px-6 py-4 backdrop-blur-xl">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-[14px] font-semibold text-green-400">Bienvenue dans le game !</span>
              </div>
            ) : (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="ton@email.com"
                  className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-[14px] text-white backdrop-blur-xl placeholder:text-white/30 transition-all focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/15"
                />
                <button
                  onClick={handleSubmit}
                  className="shrink-0 rounded-full border border-white/25 bg-[#1d4ed8] px-8 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-[#1d4ed8]/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#1d4ed8]/40 active:scale-95"
                  style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  Rejoindre
                </button>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-4 text-[10px] sm:text-[11px] text-white/30">
              <span>0% spam</span>
              <span>·</span>
              <span>Promos exclusives</span>
              <span>·</span>
              <span>1 clic pour se désabonner</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
