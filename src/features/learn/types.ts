export type LessonSectionKey =
  | "whatItIs"
  | "whyItMatters"
  | "whoItIsFor"
  | "howItWorks"
  | "importantConsiderations";

export type LessonSection = {
  key: LessonSectionKey;
  title: string;
  body: string[];
};

export type LessonLink = {
  label: string;
  href: string;
  description?: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  estimatedMinutes: number;
  sections: LessonSection[];
  nextSteps: LessonLink[];
  relatedSlugs: string[];
};
