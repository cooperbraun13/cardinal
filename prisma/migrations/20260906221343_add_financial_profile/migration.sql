-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "employmentStatus" TEXT,
    "annualIncomeRange" TEXT,
    "savingsRange" TEXT,
    "emergencyFundStatus" TEXT,
    "creditCardDebtStatus" TEXT,
    "otherDebtStatus" TEXT,
    "employer401kStatus" TEXT,
    "employerMatchStatus" TEXT,
    "investingExperience" TEXT,
    "riskComfort" TEXT,
    "profileVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_userId_key" ON "FinancialProfile"("userId");
