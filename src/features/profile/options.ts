export const EMPLOYMENT_STATUSES = [
  "employed",
  "self_employed",
  "student",
  "unemployed",
  "retired",
  "other",
] as const;

export const ANNUAL_INCOME_RANGES = [
  "under_25000",
  "25000_to_49999",
  "50000_to_74999",
  "75000_to_99999",
  "100000_to_149999",
  "150000_plus",
] as const;

export const SAVINGS_RANGES = [
  "under_1000",
  "1000_to_4999",
  "5000_to_9999",
  "10000_to_24999",
  "25000_plus",
] as const;

export const EMERGENCY_FUND_STATUSES = [
  "not_started",
  "starter_fund",
  "one_month_or_more",
  "three_months_or_more",
] as const;

export const DEBT_STATUSES = ["none", "some", "not_sure"] as const;

export const EMPLOYER_RETIREMENT_STATUSES = [
  "available",
  "not_available",
  "not_sure",
] as const;

export const INVESTING_EXPERIENCE_LEVELS = [
  "new",
  "some",
  "experienced",
] as const;

export const RISK_COMFORT_LEVELS = [
  "not_sure",
  "conservative",
  "balanced",
  "growth",
] as const;

export const PRIMARY_GOALS = [
  "reduce_debt",
  "build_emergency_fund",
  "start_investing",
  "buy_home",
  "understand_money",
] as const;

export const INVESTMENT_ACCOUNT_TYPES = [
  "none",
  "employer_plan",
  "ira",
  "brokerage",
  "hsa",
  "multiple",
] as const;

export const PROFILE_OPTION_LABELS: Record<string, string> = {
  employed: "Employed",
  self_employed: "Self-employed",
  student: "Student",
  unemployed: "Not currently employed",
  retired: "Retired",
  other: "Another situation",
  under_25000: "Under $25,000",
  "25000_to_49999": "$25,000–$49,999",
  "50000_to_74999": "$50,000–$74,999",
  "75000_to_99999": "$75,000–$99,999",
  "100000_to_149999": "$100,000–$149,999",
  "150000_plus": "$150,000 or more",
  under_1000: "Under $1,000",
  "1000_to_4999": "$1,000–$4,999",
  "5000_to_9999": "$5,000–$9,999",
  "10000_to_24999": "$10,000–$24,999",
  "25000_plus": "$25,000 or more",
  not_started: "Not started yet",
  starter_fund: "Some savings set aside",
  one_month_or_more: "About one month of expenses or more",
  three_months_or_more: "About three months of expenses or more",
  none: "None",
  some: "Some",
  not_sure: "Not sure",
  available: "Available",
  not_available: "Not available",
  new: "New to investing",
  experienced: "Experienced",
  conservative: "Prefer fewer ups and downs",
  balanced: "Comfortable with some ups and downs",
  growth: "Comfortable with larger ups and downs",
  reduce_debt: "Reduce debt",
  build_emergency_fund: "Build an emergency fund",
  start_investing: "Start investing",
  buy_home: "Prepare to buy a home",
  understand_money: "Understand money basics",
  employer_plan: "Employer plan (such as a 401(k))",
  ira: "IRA",
  brokerage: "Brokerage account",
  hsa: "HSA",
  multiple: "More than one account type",
};
