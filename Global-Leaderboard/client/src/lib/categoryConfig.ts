import { Lightbulb, Cpu, Users, TrendingUp } from "lucide-react";

export interface CategoryConfig {
  id: string;
  label: string;
  image: string;
  color: string;
  bgColor: string;
  iconName: 'Lightbulb' | 'Cpu' | 'Users' | 'TrendingUp';
}

export const categoryConfig: Record<string, CategoryConfig> = {
  ai: {
    id: 'AI',
    label: 'AI',
    image: '/blog-images/ai.png',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    iconName: 'Lightbulb'
  },
  technology: {
    id: 'Technology',
    label: 'Technology',
    image: '/blog-images/technology.png',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    iconName: 'Cpu'
  },
  leadership: {
    id: 'Leadership',
    label: 'Leadership',
    image: '/blog-images/leadership.png',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    iconName: 'Users'
  },
  business: {
    id: 'Business Strategy',
    label: 'Business Strategy',
    image: '/blog-images/business-strategy.png',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    iconName: 'TrendingUp'
  }
};

export const categoryImages: Record<string, string> = {
  "AI": "/blog-images/ai.png",
  "Technology": "/blog-images/technology.png",
  "Leadership": "/blog-images/leadership.png",
  "Business Strategy": "/blog-images/business-strategy.png"
};

export const categoryCssKeys: Record<string, string> = {
  "AI": "ai",
  "Technology": "technology",
  "Leadership": "leadership",
  "Business Strategy": "business"
};

export function getCategoryConfig(categoryId: string): CategoryConfig | undefined {
  const key = categoryId.toLowerCase().replace(/\s+/g, '');
  if (key === 'businessstrategy') return categoryConfig.business;
  return categoryConfig[key];
}

export function getCategoryImage(category: string): string {
  return categoryImages[category] || categoryImages["AI"];
}

export function getCategoryCssKey(category: string): string {
  return categoryCssKeys[category] || "ai";
}
