import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getLessonBySlug } from "@/features/learn/content";

type Params = { params: Promise<{ slug: string }> };

export default async function LessonPage({ params }: Params) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();
  const related = lesson.relatedSlugs.map(getLessonBySlug).filter((item) => item !== undefined);

  return (
    <article className="page-shell page-stack max-w-4xl">
      <header className="max-w-2xl">
        <Link href="/learn" className="text-link"><ArrowLeftIcon className="size-4" /> All lessons</Link>
        <p className="eyebrow mt-design-lg">{lesson.topic} · {lesson.estimatedMinutes} min read</p>
        <h1 className="page-title mt-design-sm">{lesson.title}</h1>
        <p className="mt-design-sm text-base leading-7 text-muted-foreground">{lesson.summary}</p>
      </header>
      <div className="grid gap-design-lg">
        {lesson.sections.map((section) => (
          <section key={section.key} className="max-w-2xl" aria-labelledby={section.key}>
            <h2 id={section.key} className="section-title">{section.title}</h2>
            {section.body.map((paragraph) => <p key={paragraph} className="mt-design-xs text-sm leading-7 text-muted-foreground">{paragraph}</p>)}
          </section>
        ))}
      </div>
      <section className="panel panel-body max-w-2xl" aria-labelledby="next-steps-heading">
        <p className="eyebrow">Next steps</p>
        <h2 id="next-steps-heading" className="mt-design-xxs section-title">Put this into context.</h2>
        <div className="mt-design-sm grid gap-design-xs">
          {lesson.nextSteps.map((step) => <Link key={step.href} href={step.href} className="text-link">{step.label} <ArrowRightIcon className="size-4" /></Link>)}
        </div>
      </section>
      {related.length > 0 && (
        <section className="border-t border-border pt-design-md max-w-2xl" aria-labelledby="related-heading">
          <p className="eyebrow">Keep learning</p>
          <h2 id="related-heading" className="mt-design-xxs section-title">Related lessons</h2>
          <div className="mt-design-sm grid gap-design-xs">
            {related.map((item) => <Link key={item.slug} href={`/learn/${item.slug}`} className="text-link">{item.title} <ArrowRightIcon className="size-4" /></Link>)}
          </div>
        </section>
      )}
    </article>
  );
}
