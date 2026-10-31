const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: number | string): string {
  return currencyFormatter.format(Number(value));
}

export function formatDate(value: Date | string): string {
  return dateFormatter.format(new Date(value));
}

export function formatImpactScore(value: number): string {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}
