"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/currency";
import { submitOrder } from "@/lib/order-service";
import type { Customer, DeliveryInfo } from "@/types/cart";

interface CheckoutWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = ["Tus datos", "Entrega", "Confirmación"] as const;

interface FormState {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  neighborhood: string;
  notes: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  neighborhood: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateDetails(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Ingresa tu nombre.";
  if (!form.phone.trim()) {
    errors.phone = "Ingresa tu teléfono.";
  } else if (form.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Ingresa un teléfono válido.";
  }
  if (form.email.trim() && !form.email.includes("@")) {
    errors.email = "Ingresa un correo válido.";
  }
  return errors;
}

function validateDelivery(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.city.trim()) errors.city = "Ingresa tu ciudad.";
  if (!form.address.trim()) errors.address = "Ingresa tu dirección.";
  if (!form.neighborhood.trim()) errors.neighborhood = "Ingresa tu barrio.";
  return errors;
}

export function CheckoutWizard({ open, onOpenChange }: CheckoutWizardProps) {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset to the first step every time the wizard is (re)opened. Adjusted
  // during render (React's recommended pattern for "state that resets when
  // a prop changes") instead of an Effect, so it doesn't cause an extra
  // render pass.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setStep(0);
  }

  const updateField = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleNext = () => {
    if (step === 0) {
      const detailErrors = validateDetails(form);
      if (Object.keys(detailErrors).length > 0) {
        setErrors(detailErrors);
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      const deliveryErrors = validateDelivery(form);
      if (Object.keys(deliveryErrors).length > 0) {
        setErrors(deliveryErrors);
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => setStep((current) => Math.max(0, current - 1));

  const handleConfirm = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const customer: Customer = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
    };
    const delivery: DeliveryInfo = {
      city: form.city.trim(),
      address: form.address.trim(),
      neighborhood: form.neighborhood.trim(),
      notes: form.notes.trim() || undefined,
    };

    try {
      await submitOrder({ items, subtotal, customer, delivery });
      toast.success("¡Pedido enviado!", {
        description: "Te abrimos WhatsApp para confirmar los detalles con nosotros.",
      });
      clearCart();
      setForm(INITIAL_FORM);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-1.5rem)] flex-col gap-4 overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Finaliza tu pedido</DialogTitle>
          <DialogDescription>Paso {step + 1} de {STEPS.length} · {STEPS[step]}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <ol className="flex items-center gap-2" aria-hidden="true">
          {STEPS.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  index < step
                    ? "bg-primary-green text-surface"
                    : index === step
                      ? "bg-primary-green text-surface"
                      : "border border-border text-text-secondary"
                }`}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className={`h-px flex-1 ${index < step ? "bg-primary-green" : "bg-border"}`}
                />
              )}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-name">Nombre</FieldLabel>
              <Input
                id="checkout-name"
                value={form.name}
                onChange={updateField("name")}
                placeholder="Tu nombre completo"
                aria-invalid={Boolean(errors.name)}
              />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-phone">Teléfono</FieldLabel>
              <Input
                id="checkout-phone"
                type="tel"
                value={form.phone}
                onChange={updateField("phone")}
                placeholder="300 123 4567"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError>{errors.phone}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-email">Correo (opcional)</FieldLabel>
              <Input
                id="checkout-email"
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="tu@correo.com"
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
          </FieldGroup>
        )}

        {step === 1 && (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-city">Ciudad</FieldLabel>
              <Input
                id="checkout-city"
                value={form.city}
                onChange={updateField("city")}
                placeholder="Ej. Cartagena"
                aria-invalid={Boolean(errors.city)}
              />
              <FieldError>{errors.city}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-address">Dirección</FieldLabel>
              <Input
                id="checkout-address"
                value={form.address}
                onChange={updateField("address")}
                placeholder="Calle, número, apto/casa"
                aria-invalid={Boolean(errors.address)}
              />
              <FieldError>{errors.address}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-neighborhood">Barrio</FieldLabel>
              <Input
                id="checkout-neighborhood"
                value={form.neighborhood}
                onChange={updateField("neighborhood")}
                placeholder="Tu barrio"
                aria-invalid={Boolean(errors.neighborhood)}
              />
              <FieldError>{errors.neighborhood}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-notes">Información adicional (opcional)</FieldLabel>
              <Textarea
                id="checkout-notes"
                value={form.notes}
                onChange={updateField("notes")}
                placeholder="Punto de referencia, horario de entrega, etc."
                rows={3}
              />
            </Field>
          </FieldGroup>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-text-primary">Productos</span>
              </div>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
                    <span className="text-text-secondary">
                      {item.productName} ({item.presentationLabel}) x{item.quantity}
                    </span>
                    <span className="shrink-0 font-medium text-text-primary">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary">Total</span>
                <span className="text-base font-bold text-text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-text-primary">Tus datos</span>
                <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={() => setStep(0)}>
                  <Pencil className="h-3 w-3" aria-hidden="true" />
                  Editar
                </Button>
              </div>
              <p className="text-text-secondary">{form.name} · {form.phone}</p>
              {form.email && <p className="text-text-secondary">{form.email}</p>}
            </div>

            <Separator />

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-text-primary">Entrega</span>
                <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={() => setStep(1)}>
                  <Pencil className="h-3 w-3" aria-hidden="true" />
                  Editar
                </Button>
              </div>
              <p className="text-text-secondary">
                {form.address}, {form.neighborhood}, {form.city}
              </p>
              {form.notes && <p className="text-text-secondary">{form.notes}</p>}
            </div>
          </div>
        )}

        <DialogFooter className="-mx-0 -mb-0 mt-2 flex-row justify-between rounded-none border-0 bg-transparent p-0 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={step === 0 ? () => onOpenChange(false) : handleBack}
            disabled={isSubmitting}
          >
            {step === 0 ? "Cancelar" : "Atrás"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" className="rounded-full bg-primary-green hover:bg-primary-dark" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-full bg-primary-green hover:bg-primary-dark"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar por WhatsApp"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
