import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { GlobalCounters } from "@/components/global-counters";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { 
  ArrowRight, 
  BookOpen,
  ExternalLink,
  Lightbulb,
  Users,
  Cpu,
  TrendingUp,
  Loader2
} from "lucide-react";
import type { BlogArticle } from "@shared/schema";

const categories = ["All", "AI", "Technology", "Leadership", "Business Strategy"];

const categoryIcons: Record<string, React.ReactNode> = {
  "AI": <Lightbulb className="h-6 w-6" />,
  "Technology": <Cpu className="h-6 w-6" />,
  "Leadership": <Users className="h-6 w-6" />,
  "Business Strategy": <TrendingUp className="h-6 w-6" />
};

const categoryImages: Record<string, string> = {
  "AI": "/blog-images/ai.png",
  "Technology": "/blog-images/technology.png",
  "Leadership": "/blog-images/leadership.png",
  "Business Strategy": "/blog-images/business-strategy.png"
};

function formatRelativeTime(date: string | Date | null): string {
  if (!date) return "";
  const now = new Date();
  const publishDate = new Date(date);
  const diffMs = now.getTime() - publishDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  if (diffMonths < 1) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
}

function getImageScale(date: string | Date | null): { scale: number; opacity: number } {
  if (!date) return { scale: 1, opacity: 1 };
  const now = new Date();
  const publishDate = new Date(date);
  const diffDays = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return { scale: 1, opacity: 1 };
  if (diffDays <= 14) return { scale: 0.9, opacity: 0.95 };
  if (diffDays <= 21) return { scale: 0.85, opacity: 0.9 };
  if (diffDays <= 30) return { scale: 0.8, opacity: 0.85 };
  return { scale: 0.75, opacity: 0.8 };
}

function openLinkedInPopup(url: string, e: React.MouseEvent) {
  e.preventDefault();
  const width = 800;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  window.open(
    url,
    'linkedin_article',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,noopener,noreferrer`
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [highlightedArticle, setHighlightedArticle] = useState<string | null>(null);
  const [location] = useLocation();
  const articleRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleTitle = params.get('article');
    if (articleTitle) {
      setHighlightedArticle(decodeURIComponent(articleTitle));
    }
  }, [location]);

  useEffect(() => {
    if (highlightedArticle && articleRefs.current.size > 0) {
      const element = articleRefs.current.get(highlightedArticle);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
        setTimeout(() => {
          setHighlightedArticle(null);
        }, 3500);
      }
    }
  }, [highlightedArticle, articleRefs.current.size]);

  const { data: articlesResponse, isLoading } = useQuery<{ data: BlogArticle[]; total: number }>({
    queryKey: ["/api/blog", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", "250");
      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      const res = await fetch(`/api/blog?${params.toString()}`);
      return res.json();
    }
  });

  const { data: featuredArticles } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog/featured"],
    queryFn: async () => {
      const res = await fetch("/api/blog/featured?limit=1");
      return res.json();
    }
  });

  const articles = articlesResponse?.data || [];
  const featuredArticle = featuredArticles?.[0];

  const formatDate = (date: string | Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-4xl px-4"
      >
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-4">
          <BookOpen className="w-4 h-4 mr-2" />
          i2u.ai Blog
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Insights for</span>
          <br />
          <span className="text-primary">Tomorrow's Unicorns</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Expert insights on AI, technology leadership, and business strategy from our LinkedIn newsletter.
        </p>

        <a 
          href="https://www.linkedin.com/newsletters/i2u-ai-blog-7359775076067467264/" 
          onClick={(e) => openLinkedInPopup("https://www.linkedin.com/newsletters/i2u-ai-blog-7359775076067467264/", e)}
          className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"
        >
          Subscribe on LinkedIn <ExternalLink className="h-4 w-4" />
        </a>

        <DynamicPricingBanner showBenefits={false} compact={true} />
        <GlobalCounters variant="full" className="mt-4" showButton={true} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCategory(category)}
              data-testid={`category-${category.toLowerCase().replace(/\s/g, '-')}`}
            >
              {category}
            </Badge>
          ))}
        </div>
      </motion.section>

      {featuredArticle && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-6xl px-4"
        >
          <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
            <div className="grid md:grid-cols-2">
              <div className="relative overflow-hidden">
                <img 
                  src={featuredArticle.imageUrl || categoryImages[featuredArticle.category] || categoryImages["AI"]} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover min-h-[250px] transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{featuredArticle.category}</Badge>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-4">{featuredArticle.excerpt}</p>
                <div className="text-sm font-medium text-primary/80 mb-4">
                  {formatRelativeTime(featuredArticle.publishedDate)}
                </div>
                {featuredArticle.linkedinUrl && (
                  <a 
                    href={featuredArticle.linkedinUrl} 
                    onClick={(e) => openLinkedInPopup(featuredArticle.linkedinUrl!, e)}
                  >
                    <Button data-testid="button-read-featured">
                      Read on LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
              </CardContent>
            </div>
          </Card>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl px-4"
      >
        <div 
          className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/ai.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/business-strategy.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/leadership.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/technology.png')` }} />
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === "All" ? "All Articles" : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {articlesResponse?.total || 0} articles from the i2u.ai newsletter
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const imageStyle = getImageScale(article.publishedDate);
              const categoryImage = categoryImages[article.category] || categoryImages["AI"];
              const displayImage = article.imageUrl || categoryImage;
              
              return (
                <div 
                  key={article.id} 
                  ref={(el) => {
                    if (el && article.title) {
                      articleRefs.current.set(article.title, el);
                    }
                  }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all group overflow-hidden ${highlightedArticle === article.title ? 'ring-4 ring-primary ring-offset-2' : ''}`} data-testid={`blog-card-${article.id}`}>
                    <div 
                      className="relative overflow-hidden"
                      style={{ 
                        height: `${140 * imageStyle.scale}px`,
                        opacity: imageStyle.opacity 
                      }}
                    >
                      <img 
                        src={displayImage} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge className="absolute bottom-2 left-2" variant="secondary">
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                        <span className="font-medium text-primary/80">{formatRelativeTime(article.publishedDate)}</span>
                        {article.linkedinUrl && (
                          <a 
                            href={article.linkedinUrl}
                            onClick={(e) => openLinkedInPopup(article.linkedinUrl!, e)}
                            className="flex items-center gap-1 text-primary hover:text-primary/80 cursor-pointer"
                          >
                            Read on LinkedIn <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
            </div>
          )}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Get the latest AI insights, leadership profiles, and business strategy content delivered to your LinkedIn feed.
            </p>
            <a 
              href="https://www.linkedin.com/newsletters/i2u-ai-blog-7359775076067467264/" 
              onClick={(e) => openLinkedInPopup("https://www.linkedin.com/newsletters/i2u-ai-blog-7359775076067467264/", e)}
            >
              <Button variant="secondary" size="lg" data-testid="button-subscribe">
                Subscribe on LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
