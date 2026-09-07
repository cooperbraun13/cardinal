import Link from "next/link";
import { ArrowRightIcon, LandmarkIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getPublishedLessons } from "@/features/learn/content";

export const metadata = { title: "Invest - Cardinal" };

export default function InvestPage() {
  const lessons = getPublishedLessons().filter(
    (lesson) => lesson.topic === "Investing",
  );

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Invest"
        title="Understand investing before you begin."
        description="Start with the account and workplace-plan concepts that make long-term investing easier to understand."
      />
      <section aria-labelledby="investing-lessons-heading">
        <div className="flex items-center gap-design-xs">
          <LandmarkIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <h2 id="investing-lessons-heading" className="section-title">Start here</h2>
        </div>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className="panel panel-body group min-h-56 transition-colors hover:bg-muted"
            >
              <p className="eyebrow">{lesson.estimatedMinutes} min read</p>
              <h3 className="mt-design-md text-xl font-medium tracking-tight">{lesson.title}</h3>
              <p className="mt-design-xs text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
              <span className="text-link mt-design-sm">Read lesson <ArrowRightIcon className="size-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
