import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import { getPublishedLessons } from "@/features/learn/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Learn - Cardinal" };

export default function LearnPage() {
  const lessons = getPublishedLessons();
  const topics = [...new Set(lessons.map((lesson) => lesson.topic))];
  const featured = lessons[0];
  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Learn / The library"
        title="Make room for understanding."
        description="Short reads. Plain language. Choose a topic and take it one idea at a time."
      />
      <div className="grid items-start gap-design-lg lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside
          className="lg:sticky lg:top-24"
          aria-labelledby="learn-topics-heading"
        >
          <div className="flex items-center gap-design-xs">
            <BookOpenIcon className="size-5" aria-hidden="true" />
            <h2 id="learn-topics-heading" className="text-lg font-medium">
              Browse topics
            </h2>
          </div>
          <p className="mt-design-xxs text-sm text-muted-foreground">
            {lessons.length} lessons to explore
          </p>
          <nav
            aria-label="Lesson topics"
            className="mt-design-sm grid grid-cols-2 gap-x-design-sm lg:grid-cols-1"
          >
            {topics.map((topic, index) => (
              <a
                key={topic}
                href={`#topic-${index}`}
                className="flex min-h-12 items-center justify-between gap-design-xs border-b border-border py-design-xxs text-sm hover:text-foreground hover:underline"
              >
                {topic}
                <span className="text-muted-foreground tabular-nums">
                  {lessons.filter((lesson) => lesson.topic === topic).length}
                </span>
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          {featured && (
            <section
              className="border-y border-foreground p-design-sm sm:p-design-md"
              aria-labelledby="featured-lesson-heading"
            >
              <p className="eyebrow">
                A place to begin / {featured.estimatedMinutes} min read
              </p>
              <h2
                id="featured-lesson-heading"
                className="section-title mt-design-sm"
              >
                {featured.title}
              </h2>
              <p className="mt-design-xs max-w-xl text-sm leading-6 text-muted-foreground">
                {featured.summary}
              </p>
              <Link
                href={`/learn/${featured.slug}`}
                className="text-link mt-design-sm"
              >
                Read the lesson{" "}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </section>
          )}
          {topics.map((topic, index) => (
            <section
              key={topic}
              id={`topic-${index}`}
              className="mt-design-lg scroll-mt-28"
              aria-labelledby={`topic-heading-${index}`}
            >
              <h2
                id={`topic-heading-${index}`}
                className="section-title border-b border-border pb-design-sm"
              >
                {topic}
              </h2>
              <ul className="divide-y divide-border">
                {lessons
                  .filter((lesson) => lesson.topic === topic)
                  .map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/learn/${lesson.slug}`}
                        className="group grid gap-design-xs py-design-sm transition-colors hover:bg-muted/35 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <h3 className="text-xl font-medium tracking-tight group-hover:underline">
                            {lesson.title}
                          </h3>
                          <p className="mt-design-xxs text-sm leading-6 text-muted-foreground">
                            {lesson.summary}
                          </p>
                        </div>
                        <span className="flex items-center gap-design-xs text-xs text-muted-foreground">
                          {lesson.estimatedMinutes} min read{" "}
                          <ArrowRightIcon
                            className="size-4"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
