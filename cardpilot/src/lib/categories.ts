// Canonical purchase categories shared by frontend and backend.

export const CATEGORIES = [
  "dining",
  "groceries",
  "travel",
  "gas",
  "transit",
  "streaming",
  "drugstores",
  "online_shopping",
  "entertainment",
  "utilities",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Special reward-rule category meaning "applies to all purchases" (the base rate). */
export const EVERYTHING = "everything";

export const CATEGORY_LABELS: Record<string, string> = {
  dining: "Dining",
  groceries: "Groceries",
  travel: "Travel",
  gas: "Gas",
  transit: "Transit",
  streaming: "Streaming",
  drugstores: "Drugstores",
  online_shopping: "Online Shopping",
  entertainment: "Entertainment",
  utilities: "Utilities",
  other: "Other",
  everything: "Everything",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export const BENEFIT_TYPES = [
  "dining_credit",
  "travel_credit",
  "streaming_credit",
  "hotel_credit",
  "airline_credit",
  "free_night",
  "lounge_access",
  "other",
] as const;

export const BENEFIT_TYPE_LABELS: Record<string, string> = {
  dining_credit: "Dining Credit",
  travel_credit: "Travel Credit",
  streaming_credit: "Streaming Credit",
  hotel_credit: "Hotel Credit",
  airline_credit: "Airline Credit",
  free_night: "Free Night",
  lounge_access: "Lounge Access",
  other: "Other",
};

export const RESET_FREQUENCIES = [
  "monthly",
  "quarterly",
  "semiannual",
  "annual",
  "one_time",
] as const;

export const REWARD_TYPES = ["points", "miles", "cashback"] as const;

export const NETWORKS = ["visa", "mastercard", "amex", "discover"] as const;

export const CARD_THEMES = [
  "midnight",
  "sapphire",
  "gold",
  "emerald",
  "ruby",
  "slate",
  "violet",
  "copper",
] as const;
