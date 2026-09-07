export const MONEY_LINKS = [
  { href: "/money", label: "Summary" },
  { href: "/dashboard", label: "Credit overview" },
  { href: "/cards", label: "Cards" },
  { href: "/transactions", label: "Activity" },
  { href: "/benefits", label: "Benefits" },
  { href: "/optimizer", label: "Best card" },
  { href: "/calculators", label: "Calculators" },
];

export const PRIMARY_LINKS = [
  { href: "/home", label: "Home", activePaths: ["/home"] },
  {
    href: "/money",
    label: "Money",
    activePaths: MONEY_LINKS.map(({ href }) => href),
  },
  { href: "/invest", label: "Invest", activePaths: ["/invest"] },
  { href: "/learn", label: "Learn", activePaths: ["/learn"] },
  { href: "/plan", label: "Plan", activePaths: ["/plan"] },
  { href: "/profile", label: "Profile", activePaths: ["/profile"] },
];

export function isNavigationPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveSection(pathname: string) {
  return PRIMARY_LINKS.find(({ activePaths }) =>
    activePaths.some((path) => isNavigationPath(pathname, path)),
  );
}
