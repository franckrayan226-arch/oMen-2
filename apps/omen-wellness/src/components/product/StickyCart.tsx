import { useCart } from "@/hooks/useCart";

interface StickyCartProps {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  variant: string | null;
  onNeedVariant: () => void;
}

export function StickyCart({ productId, slug, name, brand, price, image, variant, onNeedVariant }: StickyCartProps) {
  const addItem = useCart((s) => s.addItem);

  const handleAdd = () => {
    if (!variant) {
      onNeedVariant();
      return;
    }
    addItem({ productId, slug, name, brand, price, image, variant });
  };

  return (
    <div className="safe-bottom fixed bottom-20 left-3 right-3 z-40 sm:hidden">
      <div className="glass flex items-center gap-3 rounded-full p-2 pl-2.5">
        {image && (
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1 pl-0.5">
          <p className="label-mono truncate text-[7.5px] text-[#17211a]/55">{variant || "Choisir un format"}</p>
          <p className="text-[14px] font-bold text-[#17211a]">{price.toLocaleString("fr-FR")} <span className="text-[9.5px] font-medium text-[#17211a]/55">FCFA</span></p>
        </div>
        <button
          onClick={handleAdd}
          className={`shrink-0 rounded-full px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] ${variant ? "btn-terra" : "btn-glass"}`}
        >
          {variant ? "Ajouter" : "Format"}
        </button>
      </div>
    </div>
  );
}
