export type FinancialProfileValues = {
  employmentStatus: string | null;
  annualIncomeRange: string | null;
  savingsRange: string | null;
  emergencyFundStatus: string | null;
  creditCardDebtStatus: string | null;
  otherDebtStatus: string | null;
  employer401kStatus: string | null;
  employerMatchStatus: string | null;
  investingExperience: string | null;
  riskComfort: string | null;
};

export const emptyFinancialProfile: FinancialProfileValues = {
  employmentStatus: null,
  annualIncomeRange: null,
  savingsRange: null,
  emergencyFundStatus: null,
  creditCardDebtStatus: null,
  otherDebtStatus: null,
  employer401kStatus: null,
  employerMatchStatus: null,
  investingExperience: null,
  riskComfort: null,
};
