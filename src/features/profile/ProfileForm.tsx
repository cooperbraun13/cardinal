"use client";

import { useState } from "react";
import { Select } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/ui/button";
import {
  ANNUAL_INCOME_RANGES,
  DEBT_STATUSES,
  EMERGENCY_FUND_STATUSES,
  EMPLOYER_RETIREMENT_STATUSES,
  EMPLOYMENT_STATUSES,
  INVESTING_EXPERIENCE_LEVELS,
  PROFILE_OPTION_LABELS,
  PRIMARY_GOALS,
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
      <Select.Root<string>
        value={value}
        onValueChange={(nextValue) => onChange(field, nextValue)}
      >
        <Select.Trigger className="flex h-12 w-full items-center justify-between gap-3 rounded-sm border border-input bg-background px-3 text-left text-base transition-[background-color,border-color] duration-200 ease-out hover:border-foreground focus-visible:border-ring focus-visible:bg-background/65 focus-visible:ring-2 focus-visible:ring-ring data-open:border-foreground data-open:bg-background/65 md:text-sm">
          <Select.Value
            className="truncate data-placeholder:text-muted-foreground"
            placeholder="Prefer not to say yet"
          />
          <Select.Icon className="text-muted-foreground transition-transform duration-200 ease-out data-open:rotate-180">
            <ChevronDownIcon className="size-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            sideOffset={6}
            className="z-50 w-(--anchor-width) outline-none"
          >
            <Select.Popup className="max-h-(--available-height) origin-(--transform-origin) overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg transition-[opacity,transform] duration-200 ease-out data-ending-style:translate-y-1 data-ending-style:opacity-0 data-starting-style:-translate-y-1 data-starting-style:opacity-0">
              <Select.List className="max-h-(--available-height) overflow-y-auto p-1">
                <Select.Item
                  value={null}
                  className="relative flex min-h-11 cursor-default items-center rounded-sm py-2 pr-9 pl-3 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-foreground"
                >
                  <Select.ItemText>Prefer not to say yet</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-3 text-foreground">
                    <CheckIcon className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
                {options.map((option) => (
                  <Select.Item
                    key={option}
                    value={option}
                    className="relative flex min-h-11 cursor-default items-center rounded-sm py-2 pr-9 pl-3 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-foreground"
                  >
                    <Select.ItemText>
                      {PROFILE_OPTION_LABELS[option]}
                    </Select.ItemText>
                    <Select.ItemIndicator className="absolute right-3 text-foreground">
                      <CheckIcon className="size-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
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

      <section className="border-t border-border pt-design-md" aria-labelledby="goal-heading">
        <p className="eyebrow">Direction</p>
        <h2 id="goal-heading" className="mt-design-xxs section-title">What would feel most useful next?</h2>
        <div className="mt-design-sm max-w-md">
          <ProfileSelect field="primaryGoal" label="Primary financial goal" description="Choose one starting point. You can change it anytime." options={PRIMARY_GOALS} value={values.primaryGoal} onChange={update} />
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
