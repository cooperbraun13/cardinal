import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import { getPublishedLessons } from "@/features/learn/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Learn - Cardinal" };

export default function LearnPage() {
  const lessons = getPublishedLessons();
  return (
    <div className="page-shell page-stack">
      <PageHeader eyebrow="Learn" title="Money concepts, made clear." description="Build your understanding one focused lesson at a time, then choose a useful next step." />
      <section aria-labelledby="lessons-heading">
        <div className="flex items-center gap-design-xs">
          <BookOpenIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          <h2 id="lessons-heading" className="section-title">Start with credit basics</h2>
        </div>
        <div className="mt-design-sm grid gap-design-sm md:grid-cols-2">
          {lessons.map((lesson) => (
            <Link key={lesson.slug} href={`/learn/${lesson.slug}`} className="panel panel-body group min-h-56 transition-colors hover:bg-muted">
              <p className="eyebrow">{lesson.topic} · {lesson.estimatedMinutes} min read</p>
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
