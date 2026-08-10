const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formats a plain number of COP cents-free pesos, e.g. 4000 -> "$4.000". */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}
