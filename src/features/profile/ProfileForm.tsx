"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import {
  ANNUAL_INCOME_RANGES,
  DEBT_STATUSES,
  EMERGENCY_FUND_STATUSES,
  EMPLOYER_RETIREMENT_STATUSES,
  EMPLOYMENT_STATUSES,
  INVESTING_EXPERIENCE_LEVELS,
  PROFILE_OPTION_LABELS,
  RISK_COMFORT_LEVELS,
  SAVINGS_RANGES,
} from "@/features/profile/options";
import {
  emptyFinancialProfile,
  type FinancialProfileValues,
} from "@/features/profile/types";

type FieldName = keyof FinancialProfileValues;

function ProfileSelect({
  field,
  label,
  description,
  options,
  value,
  onChange,
}: {
  field: FieldName;
  label: string;
  description?: string;
  options: readonly string[];
  value: string | null;
  onChange: (field: FieldName, value: string | null) => void;
}) {
  return (
    <Field label={label} hint={description}>
      <NativeSelect
        value={value ?? ""}
        onChange={(event) => onChange(field, event.target.value || null)}
      >
        <option value="">Prefer not to say yet</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {PROFILE_OPTION_LABELS[option]}
          </option>
        ))}
      </NativeSelect>
    </Field>
  );
}

export function ProfileForm({
  initialValues,
}: {
  initialValues: FinancialProfileValues | null;
}) {
  const [values, setValues] = useState<FinancialProfileValues>(
    initialValues ?? emptyFinancialProfile,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function update(field: FieldName, value: string | null) {
    setSaved(false);
    setValues((current) => ({ ...current, [field]: value }));
  }

  function clear() {
    setSaved(false);
    setValues(emptyFinancialProfile);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await apiFetch("/api/profile", { method: "PUT", body: values });
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="grid gap-design-lg" aria-busy={saving}>
      {error && <ErrorBanner message={error} />}
      <section aria-labelledby="work-heading">
        <p className="eyebrow">Work and savings</p>
        <h2 id="work-heading" className="mt-design-xxs section-title">
          The basics, in ranges.
        </h2>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          <ProfileSelect
            field="employmentStatus"
            label="Work or school situation"
            options={EMPLOYMENT_STATUSES}
            value={values.employmentStatus}
            onChange={update}
          />
          <ProfileSelect
            field="annualIncomeRange"
            label="Annual income range"
            description="A range is enough. Cardinal does not need your exact income."
            options={ANNUAL_INCOME_RANGES}
            value={values.annualIncomeRange}
            onChange={update}
          />
          <ProfileSelect
            field="savingsRange"
            label="Savings range"
            description="Include cash you would consider available for goals or surprises."
            options={SAVINGS_RANGES}
            value={values.savingsRange}
            onChange={update}
          />
          <ProfileSelect
            field="emergencyFundStatus"
            label="Emergency savings"
            options={EMERGENCY_FUND_STATUSES}
            value={values.emergencyFundStatus}
            onChange={update}
          />
        </div>
      </section>

      <section className="border-t border-border pt-design-md" aria-labelledby="debt-heading">
        <p className="eyebrow">Debt and work benefits</p>
        <h2 id="debt-heading" className="mt-design-xxs section-title">
          A little context goes a long way.
        </h2>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          <ProfileSelect
            field="creditCardDebtStatus"
            label="High-interest credit card debt"
            description="A carried balance that is accruing interest."
            options={DEBT_STATUSES}
            value={values.creditCardDebtStatus}
            onChange={update}
          />
          <ProfileSelect
            field="otherDebtStatus"
            label="Other debt"
            options={DEBT_STATUSES}
            value={values.otherDebtStatus}
            onChange={update}
          />
          <ProfileSelect
            field="employer401kStatus"
            label="Employer retirement plan"
            description="For example, a 401(k), 403(b), or similar plan."
            options={EMPLOYER_RETIREMENT_STATUSES}
            value={values.employer401kStatus}
            onChange={update}
          />
          <ProfileSelect
            field="employerMatchStatus"
            label="Employer contribution match"
            options={EMPLOYER_RETIREMENT_STATUSES}
            value={values.employerMatchStatus}
            onChange={update}
          />
        </div>
      </section>

      <section className="border-t border-border pt-design-md" aria-labelledby="investing-heading">
        <p className="eyebrow">Investing</p>
        <h2 id="investing-heading" className="mt-design-xxs section-title">
          Start where you are.
        </h2>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          <ProfileSelect
            field="investingExperience"
            label="Investing experience"
            options={INVESTING_EXPERIENCE_LEVELS}
            value={values.investingExperience}
            onChange={update}
          />
          <ProfileSelect
            field="riskComfort"
            label="Comfort with investment ups and downs"
            options={RISK_COMFORT_LEVELS}
            value={values.riskComfort}
            onChange={update}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-design-sm border-t border-border pt-design-md">
        <Button type="submit" disabled={saving}>
          {saving && <LoaderCircleIcon className="size-4 animate-spin" />}
          {saving ? "Saving profile..." : "Save profile"}
        </Button>
        <Button type="button" variant="outline" onClick={clear} disabled={saving}>
          Clear form
        </Button>
        {saved && (
          <p className="text-sm text-muted-foreground" role="status">
            Your profile is saved.
          </p>
        )}
      </div>
    </form>
  );
}
