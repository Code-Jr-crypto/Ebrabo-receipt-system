import { toWords } from "number-to-words";

export function formatTZS(amount) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0
  }).format(amount);
}

export function tanzaniaWords(amount) {
  const shillings = Math.floor(amount);
  const cents = Math.round((amount - shillings) * 100);

  let words = toWords(shillings).toUpperCase() + " TANZANIA SHILLINGS";

  if (cents > 0) {
    words += " AND " + toWords(cents).toUpperCase() + " CENTS";
  }

  return words + " ONLY";
}
