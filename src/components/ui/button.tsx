import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-sm font-bold tracking-[.1em] uppercase whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        outline:
          "border-foreground bg-transparent text-foreground hover:border-foreground hover:bg-accent aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground aria-expanded:bg-accent",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/25",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 gap-2 px-design-md",
        xs: "h-12 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-12 gap-2 px-4 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-design-md",
        icon: "size-12",
        "icon-xs": "size-12 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-12",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
