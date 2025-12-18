import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BlogArticle } from "@shared/schema";

interface UseRotatingExcerptsOptions {
  category?: string;
  intervalMs?: number;
  limit?: number;
}

export function useRotatingExcerpts(options: UseRotatingExcerptsOptions = {}) {
  const { category, intervalMs = 8000, limit = 10 } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: articlesData } = useQuery<{ data: BlogArticle[]; total: number }>({
    queryKey: ["/api/blog/excerpts", category, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      if (category && category !== "All") {
        params.set("category", category);
      }
      const res = await fetch(`/api/blog?${params.toString()}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const articles = articlesData?.data || [];

  const nextExcerpt = useCallback(() => {
    if (articles.length <= 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
      setIsTransitioning(false);
    }, 300);
  }, [articles.length]);

  useEffect(() => {
    if (articles.length <= 1) return;
    
    const interval = setInterval(nextExcerpt, intervalMs);
    return () => clearInterval(interval);
  }, [articles.length, intervalMs, nextExcerpt]);

  const currentArticle = articles[currentIndex] || null;

  return {
    currentArticle,
    currentIndex,
    totalArticles: articles.length,
    isTransitioning,
    nextExcerpt,
    articles,
  };
}
