import { useCart } from "@/hooks/useCart";

interface StickyCartProps {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  selectedSize: string | null;
  onSelectSize: () => void;
}

export function StickyCart({ productId, slug, name, brand, price, image, selectedSize, onSelectSize }: StickyCartProps) {
  const addItem = useCart((s) => s.addItem);

  const handleAdd = () => {
    if (!selectedSize) { onSelectSize(); return; }
    addItem({ productId, slug, name, brand, price, image, size: selectedSize });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom sm:hidden bg-[#f5f5f5]/90 backdrop-blur-md" style={{ borderTop: "1px solid #e0d6d0" }}>
      <div className="flex items-center gap-3 px-4 py-3">
        {image && (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f0ebe7]" style={{ border: "1px solid #e0d6d0" }}>
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-[#666] truncate">{brand}{selectedSize ? ` · T${selectedSize}` : ""}</p>
          <p className="text-[16px] font-black text-[#111]">{price.toLocaleString("fr-FR")} <span className="text-[11px] font-medium text-[#666]">FCFA</span></p>
        </div>
        <button
          onClick={handleAdd}
          className={`shrink-0 rounded-lg px-5 py-3 text-[13px] font-semibold ${selectedSize ? "bg-[#1d4ed8] text-white" : "btn-secondary"}`}
        >
          {selectedSize ? "Ajouter" : "Taille ?"}
        </button>
      </div>
    </div>
  );
}
