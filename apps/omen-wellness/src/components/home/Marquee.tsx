export function Marquee() {
  const words = ["Minoxidil 5%", "Sans propylène glycol", "Notice incluse", "Lomé · 24h", "Conseil WhatsApp", "Actifs dosés"];

  return (
    <div className="mx-auto max-w-[calc(100%-1.5rem)] overflow-hidden rounded-full glass-deep py-3 sm:max-w-[calc(100%-3rem)]" aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {words.map((w) => (
              <span key={`${copy}-${w}`} className="flex items-center">
                <span className="label-mono px-6 text-[9.5px] text-[#f4efe3]/85">{w}</span>
                <span className="h-[5px] w-[5px] rotate-45 bg-[#c46034]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
