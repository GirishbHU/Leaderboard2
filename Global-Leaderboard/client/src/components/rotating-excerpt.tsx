import { motion, AnimatePresence } from "framer-motion";
import { useRotatingExcerpts } from "@/hooks/useRotatingExcerpts";
import { getCategoryImage } from "@/lib/categoryConfig";
import { ExternalLink, Quote, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RotatingExcerptProps {
  category?: string;
  intervalMs?: number;
  showCategory?: boolean;
  showImage?: boolean;
  className?: string;
  compact?: boolean;
}

export function RotatingExcerpt({
  category,
  intervalMs = 8000,
  showCategory = true,
  showImage = true,
  className = "",
  compact = false,
}: RotatingExcerptProps) {
  const { currentArticle, isTransitioning, totalArticles, currentIndex } = useRotatingExcerpts({
    category,
    intervalMs,
    limit: 10,
  });

  if (!currentArticle) {
    return null;
  }

  const categoryImage = getCategoryImage(currentArticle.category);
  const articleImage = currentArticle.imageUrl || categoryImage;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {showImage && (
        <div className="absolute inset-0 pointer-events-none max-h-[20vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${categoryImage})`, opacity: 0.1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        </div>
      )}
      
      <div className="relative z-10 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3"
          >
            <div className="shrink-0">
              {currentArticle.imageUrl ? (
                <img 
                  src={currentArticle.imageUrl} 
                  alt="" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary/50" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              {showCategory && (
                <Badge variant="secondary" className="text-xs">
                  {currentArticle.category}
                </Badge>
              )}
              
              <h4 className={`font-semibold ${compact ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'}`}>
                {currentArticle.title}
              </h4>
              {!compact && currentArticle.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {currentArticle.excerpt}
                </p>
              )}
              
              {currentArticle.linkedinUrl && (
                <a 
                  href={currentArticle.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Read more <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {totalArticles > 1 && (
          <div className="flex gap-1 mt-3 justify-center">
            {Array.from({ length: Math.min(totalArticles, 5) }).map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full transition-colors ${
                  i === currentIndex % 5 ? 'bg-primary' : 'bg-primary/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface RotatingExcerptGridProps {
  categories?: string[];
  className?: string;
}

export function RotatingExcerptGrid({ 
  categories = ["AI", "Technology", "Leadership", "Business Strategy"],
  className = "" 
}: RotatingExcerptGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {categories.map((cat, index) => (
        <RotatingExcerpt
          key={cat}
          category={cat}
          intervalMs={8000 + index * 2000}
          compact
          showImage={false}
          className="bg-card/50 backdrop-blur-sm border border-border"
        />
      ))}
    </div>
  );
}
