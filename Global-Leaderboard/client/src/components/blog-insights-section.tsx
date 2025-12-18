import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { BlogArticle } from "@shared/schema";

const categoryImages: Record<string, string> = {
  "AI": "/blog-images/ai.png",
  "Technology": "/blog-images/technology.png",
  "Leadership": "/blog-images/leadership.png",
  "Business Strategy": "/blog-images/business-strategy.png"
};

interface BlogInsightsSectionProps {
  className?: string;
  showTitle?: boolean;
  showExploreButton?: boolean;
}

export function BlogInsightsSection({ 
  className = "",
  showTitle = true,
  showExploreButton = true 
}: BlogInsightsSectionProps) {
  const [rotationKey, setRotationKey] = useState(0);

  const { data: articlesData } = useQuery<{ data: BlogArticle[]; total: number }>({
    queryKey: ["/api/blog/insights", 10],
    queryFn: async () => {
      const res = await fetch("/api/blog?limit=10");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const articles = articlesData?.data?.slice(0, 10) || [];

  useEffect(() => {
    if (articles.length === 0) return;

    const interval = setInterval(() => {
      setRotationKey(prev => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return null;
  }

  const getRotatedArticles = () => {
    if (articles.length === 0) return [];
    const offset = rotationKey % articles.length;
    return [...articles.slice(offset), ...articles.slice(0, offset)];
  };

  const rotatedArticles = getRotatedArticles();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`w-full max-w-6xl px-4 ${className}`}
    >
      <div 
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Composite background with 4 category images at 85% transparency */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/ai.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/business-strategy.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/leadership.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/technology.png')` }} />
        </div>
        
        <div className="relative z-10">
          {showTitle && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                Articles from Our Blog
              </h2>
              <p className="text-muted-foreground">Expert perspectives on AI, technology, and startup growth</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {rotatedArticles.map((article, index) => (
                <motion.div
                  key={`${article.id}-${rotationKey}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  layout
                  className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <img 
                        src={article.imageUrl || categoryImages[article.category] || categoryImages["AI"]} 
                        alt="" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {article.category}
                      </Badge>
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <Link 
                        href={`/blog?article=${encodeURIComponent(article.title)}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Read more <BookOpen className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {showExploreButton && (
            <div className="text-center mt-6">
              <Link href="/blog">
                <Button variant="outline" className="bg-background/80 hover:bg-background">
                  Explore All Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
