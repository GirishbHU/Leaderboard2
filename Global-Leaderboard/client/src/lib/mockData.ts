import { z } from "zod";

// --- Types ---

export type UserRole = "builder" | "investor" | "enabler" | "startup" | "influencer" | "professional" | "accelerator" | "ngo" | "vc" | "government" | "mentor" | "service_provider" | "angel";
export type Currency = "INR" | "USD";
export type DisplayPreference = "real_name" | "username" | "anonymous" | "fancy_username";
export type SubscriptionTier = "Beginner" | "Professional" | "Advanced" | "Pro Max Ultra";

export interface User {
  id: string;
  email: string;
  name: string; // real name
  username?: string; // generated or chosen
  role: UserRole;
  country: string;
  sector: string;
  currency: Currency;
  displayPreference: DisplayPreference;
  displayName?: string;
  showOnLeaderboard?: boolean;
  anonymousMode?: boolean;
  companyName?: string;
  startupStage?: string;
  
  registrationNumber: number;
  registrationDate: string;
  
  referralCode: string;
  referralCount: number;
  referralEarningsINR: number;
  referralEarningsUSD: number;
  showEarningsPublicly: boolean;
  
  walletINR: {
    available: number;
    pending: number;
  };
  walletUSD: {
    available: number;
    pending: number;
  };
  
  leaderboardRank: number;
  percentile: number;
  subscriptionTier: SubscriptionTier;
  status: "verified" | "pending";
}

// --- Mock Data: 78 Anonymous Users ---

const MOCK_COUNTRIES = [
  "India", "USA", "Singapore", "UK", "Germany", "Australia", "Canada", "UAE", 
  "Japan", "France", "Netherlands", "Israel", "South Korea", "Brazil", "Indonesia",
  "Vietnam", "Philippines", "Malaysia", "Thailand", "Nigeria", "Kenya", "South Africa",
  "Egypt", "Saudi Arabia", "Qatar", "Bahrain", "Ireland", "Sweden", "Switzerland", "Spain"
];

const MOCK_SECTORS = [
  "Fintech", "Healthtech", "Edtech", "SaaS", "E-commerce", "AI & ML", "Clean Energy",
  "Logistics & Supply Chain", "Manufacturing", "Real Estate", "Retail", "Cybersecurity", 
  "Biotech", "AgriTech", "Gaming", "SpaceTech", "Robotics", "IoT", "Media & Entertainment",
  "Legal Tech", "HR Tech", "PropTech", "InsurTech", "FoodTech", "Travel Tech", "MarTech"
];

const MOCK_ROLES: UserRole[] = [
  "startup", "startup", "startup", "startup", // Higher weight for startups
  "investor", "investor", "vc", "angel",
  "mentor", "mentor", "service_provider", "service_provider",
  "accelerator", "professional", "enabler", "government", "ngo"
];

const MOCK_TIERS: SubscriptionTier[] = ["Beginner", "Professional", "Advanced", "Pro Max Ultra"];

const STARTUP_STAGES = ["Idea", "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Growth"];

function generateMockUser(rank: number): User {
  const role = MOCK_ROLES[rank % MOCK_ROLES.length];
  const country = MOCK_COUNTRIES[rank % MOCK_COUNTRIES.length];
  const sector = MOCK_SECTORS[rank % MOCK_SECTORS.length];
  const currency: Currency = country === "India" || ["UAE", "Saudi Arabia", "Qatar", "Bahrain"].includes(country) ? "INR" : "USD";
  const tier = MOCK_TIERS[Math.floor(rank / 20) % MOCK_TIERS.length];
  const isStartup = ["startup", "builder"].includes(role);
  
  const referralCount = Math.max(0, 30 - rank + Math.floor(Math.random() * 10));
  const referralEarningsINR = referralCount * 100;
  const referralEarningsUSD = Math.floor(referralCount * 1.5);
  
  return {
    registrationNumber: rank,
    id: `user-${rank}-${Date.now()}`,
    email: `user${rank}@example.com`,
    name: `User ${rank}`,
    username: `User ${rank}`,
    role,
    country,
    sector,
    displayPreference: "anonymous",
    currency,
    companyName: isStartup ? `Company ${rank}` : undefined,
    startupStage: isStartup ? STARTUP_STAGES[rank % STARTUP_STAGES.length] : undefined,
    referralCode: `REF${10000 + rank}`,
    referralCount,
    referralEarningsINR,
    referralEarningsUSD,
    showEarningsPublicly: rank % 3 !== 0,
    walletINR: { 
      available: Math.floor(referralEarningsINR * 0.5), 
      pending: Math.floor(referralEarningsINR * 0.5) 
    },
    walletUSD: { 
      available: Math.floor(referralEarningsUSD * 0.5), 
      pending: Math.floor(referralEarningsUSD * 0.5) 
    },
    leaderboardRank: rank,
    percentile: Math.min(99, (rank / 78) * 100),
    subscriptionTier: tier,
    registrationDate: new Date(Date.now() - rank * 24 * 60 * 60 * 1000).toISOString(),
    status: rank % 5 === 0 ? "pending" : "verified"
  };
}

// Generate exactly 78 anonymous users
export const MOCK_USERS: User[] = [];
for (let i = 1; i <= 78; i++) {
  MOCK_USERS.push(generateMockUser(i));
}

// Current User Mock - Rank 50 (middle of the pack)
export const CURRENT_USER: User = MOCK_USERS.find(u => u.leaderboardRank === 50) || MOCK_USERS[MOCK_USERS.length - 1];

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const BASE_SECTORS = [
  "AgriTech", "Artificial Intelligence", "Biotech", "Blockchain", "Clean Energy", "ClimateTech",
  "Cybersecurity", "E-commerce", "Edtech", "Fintech", "FoodTech", "Gaming", "Healthtech",
  "HR Tech", "InsurTech", "IoT", "Legal Tech", "Logistics", "Manufacturing", "MarTech",
  "PropTech", "Real Estate", "RegTech", "Retail", "Robotics", "SaaS", "Social Media",
  "SpaceTech", "Travel Tech", "WealthTech"
];

export const SECTORS = [
  ...BASE_SECTORS.slice(0, BASE_SECTORS.indexOf("PropTech")),
  "Others",
  ...BASE_SECTORS.slice(BASE_SECTORS.indexOf("PropTech")),
  "Others (Suggest New)"
];

export const OTHERS_SECTOR_VALUE = "Others";
export const OTHERS_SUGGEST_VALUE = "Others (Suggest New)";

// --- Mock API Functions ---

export const getLeaderboard = async (page = 1, limit = 10, country?: string, sector?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...MOCK_USERS];
  
  if (country && country !== "All") {
    filtered = filtered.filter(u => u.country === country);
  }
  
  if (sector && sector !== "All") {
    filtered = filtered.filter(u => u.sector === sector);
  }
  
  filtered.sort((a, b) => a.leaderboardRank - b.leaderboardRank);
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit)
  };
};

export const getLeaderboardContext = async (centerRank: number, range: number = 5) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sorted = [...MOCK_USERS].sort((a, b) => a.leaderboardRank - b.leaderboardRank);
  
  const centerIndex = sorted.findIndex(u => u.leaderboardRank === centerRank);
  if (centerIndex === -1) return sorted.slice(0, range * 2);
  
  const start = Math.max(0, centerIndex - range);
  const end = Math.min(sorted.length, centerIndex + range + 1);
  
  return sorted.slice(start, end);
};
