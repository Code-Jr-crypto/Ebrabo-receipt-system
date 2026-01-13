// Format number into Tanzanian Shillings
export const formatTZS = (amount) => {
  return new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

// Add commas: 1000000 → 1,000,000
export const addCommas = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = value.toString().replace(/,/g, "");
  if (isNaN(num)) return value;
  return Number(num).toLocaleString("en-US");
};

// Remove commas: 1,000,000 → 1000000
export const removeCommas = (value) => {
  if (!value) return 0;
  return Number(value.toString().replace(/,/g, ""));
};

// Convert numbers into words (English)
export const numberToWords = (num) => {
  num = Number(num);
  if (!num || num === 0) return "Zero";

  const belowTwenty = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  const thousands = ["", "Thousand", "Million", "Billion"];

  const helper = (n) => {
    if (n < 20) return belowTwenty[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + " " + belowTwenty[n % 10];
    if (n < 1000)
      return (
        belowTwenty[Math.floor(n / 100)] +
        " Hundred " +
        helper(n % 100)
      );
    return "";
  };

  let words = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      words = helper(num % 1000) + " " + thousands[i] + " " + words;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return words.trim();
};
