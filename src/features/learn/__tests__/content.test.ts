import { describe, expect, it } from "vitest";
import { getLessonBySlug, lessons } from "@/features/learn/content";

const requiredSectionKeys = [
  "whatItIs",
  "whyItMatters",
  "whoItIsFor",
  "howItWorks",
  "importantConsiderations",
];

describe("lesson content", () => {
  it("keeps every published lesson in the shared beginner lesson format", () => {
    for (const lesson of lessons) {
      expect(lesson.sections.map((section) => section.key)).toEqual(requiredSectionKeys);
      expect(lesson.nextSteps.length).toBeGreaterThan(0);
    }
  });

  it("only links related lessons that are published", () => {
    for (const lesson of lessons) {
      for (const relatedSlug of lesson.relatedSlugs) {
        expect(getLessonBySlug(relatedSlug)).toBeDefined();
      }
    }
  });
});
