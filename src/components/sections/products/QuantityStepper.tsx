import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label: string;
}

/** Reusable -/+ quantity control, used both in the product picker and the cart. */
export function QuantityStepper({ value, onChange, min = 1, max = 20, label }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        disabled={value <= min}
        aria-label={`Disminuir cantidad de ${label}`}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      <span className="w-7 text-center text-sm font-semibold text-text-primary tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        disabled={value >= max}
        aria-label={`Aumentar cantidad de ${label}`}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
