import Image from "next/image";

export function CinematicHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="cinema-hero">
      <Image
        src="/cardinal-cinema-hd.png"
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
      />
      <div className="cinema-copy">
        <p className="eyebrow mb-design-sm">{eyebrow}</p>
        <h1 className="cinema-title">{title}</h1>
        {description && (
          <p className="cinema-description mt-design-sm">{description}</p>
        )}
        {actions && (
          <div className="mt-design-md flex flex-wrap gap-design-xs">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
