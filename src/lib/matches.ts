export type Stage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third Place"
  | "Final";

export type Category = "Cat1" | "Cat2" | "Cat3" | "Cat4";

export interface PriceTier {
  category: Category;
  label: string;
  description: string;
  priceUsd: number;
}

export interface Match {
  id: string;
  stage: Stage;
  matchNo: string;
  group?: string;
  date: string; // ISO
  kickoffLocal: string; // "20:00"
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  venue: string;
  city: string;
  country: string;
  prices: PriceTier[];
  featured?: boolean;
}

// FIFA-published starting prices (USD) by stage. Cat4 = lowest, Cat1 = best seat.
const PRICES: Record<Stage, Record<Category, number>> = {
  "Group Stage":   { Cat4: 60,   Cat3: 160,  Cat2: 315,  Cat1: 555 },
  "Round of 32":   { Cat4: 85,   Cat3: 205,  Cat2: 400,  Cat1: 695 },
  "Round of 16":   { Cat4: 105,  Cat3: 255,  Cat2: 495,  Cat1: 860 },
  "Quarter-final": { Cat4: 185,  Cat3: 445,  Cat2: 870,  Cat1: 1510 },
  "Semi-final":    { Cat4: 455,  Cat3: 1095, Cat2: 2135, Cat1: 3715 },
  "Third Place":   { Cat4: 295,  Cat3: 705,  Cat2: 1380, Cat1: 2400 },
  "Final":         { Cat4: 2030, Cat3: 3370, Cat2: 5040, Cat1: 6730 },
};

const tiers = (stage: Stage): PriceTier[] => [
  { category: "Cat1", label: "Category 1", description: "Premium seats — closest to halfway line", priceUsd: PRICES[stage].Cat1 },
  { category: "Cat2", label: "Category 2", description: "Lower tier, between corner flag and goal", priceUsd: PRICES[stage].Cat2 },
  { category: "Cat3", label: "Category 3", description: "Mid-tier seating, full pitch view", priceUsd: PRICES[stage].Cat3 },
  { category: "Cat4", label: "Category 4", description: "Upper tier — host-country residents pricing", priceUsd: PRICES[stage].Cat4 },
];

export const matches: Match[] = [
  {
    id: "wc26-01",
    stage: "Group Stage",
    matchNo: "Match 1",
    group: "Group A",
    date: "2026-06-11",
    kickoffLocal: "20:00",
    homeTeam: "Mexico",
    homeFlag: "🇲🇽",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    prices: tiers("Group Stage"),
    featured: true,
  },
  {
    id: "wc26-02",
    stage: "Group Stage",
    matchNo: "Match 4",
    group: "Group D",
    date: "2026-06-12",
    kickoffLocal: "18:00",
    homeTeam: "USA",
    homeFlag: "🇺🇸",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    prices: tiers("Group Stage"),
    featured: true,
  },
  {
    id: "wc26-03",
    stage: "Group Stage",
    matchNo: "Match 7",
    group: "Group B",
    date: "2026-06-12",
    kickoffLocal: "20:00",
    homeTeam: "Canada",
    homeFlag: "🇨🇦",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "BMO Field",
    city: "Toronto",
    country: "Canada",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-04",
    stage: "Group Stage",
    matchNo: "Match 12",
    group: "Group C",
    date: "2026-06-14",
    kickoffLocal: "15:00",
    homeTeam: "Argentina",
    homeFlag: "🇦🇷",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    prices: tiers("Group Stage"),
    featured: true,
  },
  {
    id: "wc26-05",
    stage: "Group Stage",
    matchNo: "Match 18",
    group: "Group E",
    date: "2026-06-15",
    kickoffLocal: "21:00",
    homeTeam: "Brazil",
    homeFlag: "🇧🇷",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
    prices: tiers("Group Stage"),
    featured: true,
  },
  {
    id: "wc26-06",
    stage: "Group Stage",
    matchNo: "Match 22",
    group: "Group F",
    date: "2026-06-16",
    kickoffLocal: "18:00",
    homeTeam: "France",
    homeFlag: "🇫🇷",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-07",
    stage: "Group Stage",
    matchNo: "Match 28",
    group: "Group G",
    date: "2026-06-17",
    kickoffLocal: "20:00",
    homeTeam: "Spain",
    homeFlag: "🇪🇸",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-08",
    stage: "Group Stage",
    matchNo: "Match 34",
    group: "Group H",
    date: "2026-06-18",
    kickoffLocal: "19:00",
    homeTeam: "England",
    homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-09",
    stage: "Group Stage",
    matchNo: "Match 41",
    group: "Group I",
    date: "2026-06-19",
    kickoffLocal: "21:00",
    homeTeam: "Germany",
    homeFlag: "🇩🇪",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "Levi's Stadium",
    city: "San Francisco Bay",
    country: "USA",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-10",
    stage: "Group Stage",
    matchNo: "Match 47",
    group: "Group J",
    date: "2026-06-20",
    kickoffLocal: "18:00",
    homeTeam: "Portugal",
    homeFlag: "🇵🇹",
    awayTeam: "TBD",
    awayFlag: "⚽",
    venue: "GEHA Field at Arrowhead",
    city: "Kansas City",
    country: "USA",
    prices: tiers("Group Stage"),
  },
  {
    id: "wc26-r32-01",
    stage: "Round of 32",
    matchNo: "Match 73",
    date: "2026-06-28",
    kickoffLocal: "16:00",
    homeTeam: "1A",
    homeFlag: "🏆",
    awayTeam: "2B",
    awayFlag: "🏆",
    venue: "NRG Stadium",
    city: "Houston",
    country: "USA",
    prices: tiers("Round of 32"),
  },
  {
    id: "wc26-r16-01",
    stage: "Round of 16",
    matchNo: "Match 89",
    date: "2026-07-04",
    kickoffLocal: "17:00",
    homeTeam: "W73",
    homeFlag: "🏆",
    awayTeam: "W74",
    awayFlag: "🏆",
    venue: "Lumen Field",
    city: "Seattle",
    country: "USA",
    prices: tiers("Round of 16"),
  },
  {
    id: "wc26-qf-01",
    stage: "Quarter-final",
    matchNo: "Match 97",
    date: "2026-07-09",
    kickoffLocal: "20:00",
    homeTeam: "W89",
    homeFlag: "🏆",
    awayTeam: "W90",
    awayFlag: "🏆",
    venue: "Gillette Stadium",
    city: "Boston",
    country: "USA",
    prices: tiers("Quarter-final"),
    featured: true,
  },
  {
    id: "wc26-sf-01",
    stage: "Semi-final",
    matchNo: "Match 101",
    date: "2026-07-14",
    kickoffLocal: "21:00",
    homeTeam: "W97",
    homeFlag: "🏆",
    awayTeam: "W98",
    awayFlag: "🏆",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    prices: tiers("Semi-final"),
    featured: true,
  },
  {
    id: "wc26-3rd",
    stage: "Third Place",
    matchNo: "Match 103",
    date: "2026-07-18",
    kickoffLocal: "16:00",
    homeTeam: "L101",
    homeFlag: "🏆",
    awayTeam: "L102",
    awayFlag: "🏆",
    venue: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    prices: tiers("Third Place"),
  },
  {
    id: "wc26-final",
    stage: "Final",
    matchNo: "Match 104",
    date: "2026-07-19",
    kickoffLocal: "15:00",
    homeTeam: "W101",
    homeFlag: "🏆",
    awayTeam: "W102",
    awayFlag: "🏆",
    venue: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    prices: tiers("Final"),
    featured: true,
  },
];

export const getMatch = (id: string) => matches.find((m) => m.id === id);

export const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
