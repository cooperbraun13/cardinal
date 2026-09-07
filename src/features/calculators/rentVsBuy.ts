import { calculateMortgagePayment } from "./mortgagePayment";

export type RentVsBuyInput = {
  monthlyRent: number;
  homePrice: number;
  downPayment: number;
  mortgageRatePercent: number;
  years: number;
  annualPropertyTaxAndInsurance: number;
};

export type RentVsBuyResult = {
  totalRent: number;
  totalBuyCashPaid: number;
  difference: number;
  monthlyMortgagePayment: number;
};

const roundToCents = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) throw new Error("Rent-versus-buy result is outside the supported range.");
  return rounded;
};

export function compareRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const { monthlyRent, homePrice, downPayment, mortgageRatePercent, years, annualPropertyTaxAndInsurance } = input;
  if (![monthlyRent, homePrice, downPayment, mortgageRatePercent, years, annualPropertyTaxAndInsurance].every(Number.isFinite)) throw new Error("Rent-versus-buy inputs must be finite numbers.");
  if ([monthlyRent, homePrice, downPayment, mortgageRatePercent, annualPropertyTaxAndInsurance].some((value) => value < 0) || years <= 0) throw new Error("Rent-versus-buy inputs are outside the supported range.");
  if (downPayment > homePrice) throw new Error("Down payment cannot exceed home price.");
  const mortgage = calculateMortgagePayment({ principal: homePrice - downPayment, annualRatePercent: mortgageRatePercent, years });
  const totalRent = roundToCents(monthlyRent * 12 * years);
  const totalBuyCashPaid = roundToCents(downPayment + mortgage.totalPayments + annualPropertyTaxAndInsurance * years);
  return { totalRent, totalBuyCashPaid, difference: roundToCents(totalRent - totalBuyCashPaid), monthlyMortgagePayment: mortgage.monthlyPrincipalAndInterest };
}
