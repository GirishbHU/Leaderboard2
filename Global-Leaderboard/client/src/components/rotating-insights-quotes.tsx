import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Quote, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import type { BlogArticle } from "@shared/schema";

interface ArticleQuote {
  quote: string;
  articleTitle: string;
  articleUrl: string;
  imageUrl?: string;
}

const generateIntriguingQuotes = (articles: BlogArticle[]): ArticleQuote[] => {
  const quoteTemplates: { [key: string]: string[] } = {
    "DevRev": [
      "The future of enterprise software lies in bridging the gap between developers and customers - a revolution that will reshape how we build products.",
      "When developers truly understand customer pain points, magic happens. DevRev is proving this thesis at scale."
    ],
    "Zeroth Principles": [
      "Before innovation comes insight. The greatest breakthroughs emerge from questioning the very foundations of what we assume to be true.",
      "AI as spectacle reveals humanity's infinite capacity for self-reflection - we are building mirrors that show us who we might become.",
      "The insight precedes the invention. Every unicorn was first a question that nobody else thought to ask."
    ],
    "Seven-Year-Old Test": [
      "If an AI cannot explain its reasoning to a seven-year-old, it hasn't achieved true understanding - only sophisticated pattern matching.",
      "Artificial common sense may be the final frontier of AI - teaching machines not just to think, but to intuit."
    ],
    "Quantum": [
      "Quantum computing isn't just faster computation - it's an entirely new way of thinking about what's possible.",
      "The physicist-CEO represents a new archetype: leaders who bridge fundamental science and market disruption."
    ],
    "Causal Inference": [
      "Moving from prediction to understanding is the leap that separates narrow AI from true intelligence.",
      "The machines that will transform our world won't just predict the future - they'll understand why it unfolds."
    ],
    "Hybrid Cloud": [
      "The architects of digital infrastructure are building the invisible foundations upon which tomorrow's unicorns will rise.",
      "Visionary leaders don't just reshape industries - they reimagine the very fabric of enterprise technology."
    ],
    "Meta": [
      "From a Harvard dorm room to reshaping human connection - the Meta story teaches us that audacity scales.",
      "The metaverse pivot isn't a bet on virtual reality - it's a bet on the future of human experience itself.",
      "Llama, AGI, and the 2025-'30 vision reveal a company betting everything on artificial general intelligence."
    ],
    "AGI": [
      "World models and cognitive development may hold the key to building truly artificial minds.",
      "The path to AGI isn't through bigger models - it's through deeper understanding of how minds emerge."
    ],
    "Physics-Informed": [
      "Embedding the laws of nature into AI creates machines that don't just learn patterns - they understand principles.",
      "When AI respects the physics of our universe, it gains wisdom that pure data alone cannot provide."
    ],
    "AI Spring": [
      "We've moved beyond pattern recognition - the next frontier is understanding the unknown laws that govern our world.",
      "The AI winter is behind us, but true spring requires moving from imitation to genuine comprehension."
    ],
    "Netflix": [
      "From DVD disruption to streaming dominance - Netflix teaches us that the only constant is reinvention.",
      "The entertainment industry consolidation isn't just business - it's a preview of how AI will reshape all industries."
    ],
    "Nuclear Renaissance": [
      "The nuclear renaissance isn't about old technology - it's about new thinking for our energy future.",
      "Building Oklo required more than engineering excellence - it required reimagining nuclear's role in civilization."
    ],
    "Monte Carlo": [
      "Monte Carlo simulation's impact on AI reveals how uncertainty itself can be a tool for discovery.",
      "Probabilistic thinking isn't a limitation of AI - it's a superpower that mimics how the universe actually works."
    ],
    "Quantinuum": [
      "The quantum revolution needs architects who understand both the physics and the market opportunity.",
      "Behind every quantum breakthrough is a leader who refused to accept classical limitations."
    ],
    "Microsoft": [
      "Copilot integration isn't just a product - it's Microsoft's vision of how humans and AI will collaborate forever.",
      "The path to AGI runs through quantum computing, AI infrastructure, and a 10-year vision that most can't yet imagine."
    ]
  };

  const quotes: ArticleQuote[] = [];
  
  articles.forEach(article => {
    const title = article.title || "";
    const url = `/blog?article=${encodeURIComponent(title)}`;
    const imageUrl = article.imageUrl || undefined;
    
    Object.keys(quoteTemplates).forEach(keyword => {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        quoteTemplates[keyword].forEach(quote => {
          quotes.push({
            quote,
            articleTitle: title,
            articleUrl: url,
            imageUrl
          });
        });
      }
    });
  });

  if (quotes.length === 0) {
    articles.slice(0, 10).forEach(article => {
      const title = article.title || "Featured Article";
      quotes.push({
        quote: `"${article.title}" - Discover the insights that are reshaping our understanding of technology, business, and the future of innovation.`,
        articleTitle: title,
        articleUrl: `/blog?article=${encodeURIComponent(title)}`,
        imageUrl: article.imageUrl || undefined
      });
    });
  }

  return quotes.slice(0, 30);
};

interface RotatingInsightsQuotesProps {
  className?: string;
  variant?: "default" | "compact" | "minimal" | "hero" | "sidebar";
  startOffset?: number;
}

export function RotatingInsightsQuotes({ 
  className = "",
  variant = "default",
  startOffset = 0
}: RotatingInsightsQuotesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: articlesData } = useQuery<{ data: BlogArticle[]; total: number }>({
    queryKey: ["/api/blog/quotes"],
    queryFn: async () => {
      const res = await fetch("/api/blog?limit=20");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const articles = articlesData?.data || [];
  const quotes = generateIntriguingQuotes(articles);

  useEffect(() => {
    if (quotes.length === 0) return;
    
    // Use startOffset to position this instance at a specific point in the rotation
    // For half-distance separation, pass startOffset = Math.floor(quotes.length / 2)
    const initialIndex = startOffset % quotes.length;
    setCurrentIndex(initialIndex);
  }, [quotes.length, startOffset]);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  if (quotes.length === 0) {
    return null;
  }

  const currentQuote = quotes[currentIndex];

  if (variant === "minimal") {
    return (
      <div className={`w-full ${className}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <p className="text-base italic text-muted-foreground max-w-2xl mx-auto">
              "{currentQuote.quote}"
            </p>
            <a 
              href={currentQuote.articleUrl}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
            >
              Read: {currentQuote.articleTitle.slice(0, 50)}... <BookOpen className="h-3 w-3" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`h-full flex flex-col ${className}`}>
        <div className="flex-1 flex flex-col justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {currentQuote.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={currentQuote.imageUrl} 
                    alt="" 
                    className="w-20 h-20 mx-auto rounded-full object-cover border-3 border-primary/40 shadow-lg"
                  />
                </div>
              )}
              
              <blockquote className="text-base font-bold leading-relaxed mb-3 text-foreground line-clamp-10">
                "{currentQuote.quote.slice(0, 356)}..."
              </blockquote>
              
              <a 
                href={currentQuote.articleUrl}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold"
              >
                <span className="line-clamp-2">{currentQuote.articleTitle.slice(0, 90)}...</span>
                <BookOpen className="h-4 w-4 shrink-0" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center gap-1.5 pb-3">
          {quotes.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex % 5 === index 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
        <div 
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden min-h-[200px]"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="flex items-start gap-6"
              >
                <div className="shrink-0">
                  {currentQuote.imageUrl ? (
                    <img 
                      src={currentQuote.imageUrl} 
                      alt="" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center shadow-lg">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Quote className="h-8 w-8 text-primary/50 mb-3" />
                  <p className="text-foreground text-lg md:text-xl italic leading-relaxed mb-4">
                    {currentQuote.quote}
                  </p>
                  <a 
                    href={currentQuote.articleUrl}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-base"
                  >
                    <span className="line-clamp-1">From: {currentQuote.articleTitle}</span>
                    <BookOpen className="h-4 w-4 shrink-0" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 ${className}`}>
        <div 
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden min-h-[400px] flex items-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Composite background with 4 category images at 85% transparency */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/ai.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/business-strategy.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/leadership.png')` }} />
            <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/technology.png')` }} />
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Insights from Our Articles</h3>
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center"
              >
                {currentQuote.imageUrl && (
                  <div className="mb-8">
                    <img 
                      src={currentQuote.imageUrl} 
                      alt="" 
                      className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-primary/40 shadow-2xl"
                    />
                  </div>
                )}
                
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed mb-8 max-w-5xl mx-auto">
                  "{currentQuote.quote}"
                </blockquote>
                
                <a 
                  href={currentQuote.articleUrl}
                  className="inline-flex items-center gap-3 bg-primary/20 hover:bg-primary/30 px-6 py-3 rounded-full text-primary font-semibold transition-all hover:scale-105"
                >
                  <span>Read Full Article: {currentQuote.articleTitle.slice(0, 40)}...</span>
                  <BookOpen className="h-5 w-5" />
                </a>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-10">
              {quotes.slice(0, 8).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex % 8 === index 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <div 
        className="rounded-3xl p-10 md:p-16 relative overflow-hidden min-h-[350px] flex items-center"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(14px)'
        }}
      >
        {/* Composite background with 4 category images at 85% transparency */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/ai.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/business-strategy.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/leadership.png')` }} />
          <div className="bg-cover bg-center" style={{ backgroundImage: `url('/blog-images/technology.png')` }} />
        </div>
        
        <div className="relative z-10 w-full">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Quote className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Featured Insights</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -25 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              {currentQuote.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={currentQuote.imageUrl} 
                    alt="" 
                    className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-primary/30 shadow-xl"
                  />
                </div>
              )}
              
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed mb-6 max-w-4xl mx-auto">
                "{currentQuote.quote}"
              </blockquote>
              
              <a 
                href={currentQuote.articleUrl}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg"
              >
                <span>From: {currentQuote.articleTitle.slice(0, 50)}...</span>
                <BookOpen className="h-5 w-5" />
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-8">
            {quotes.slice(0, 6).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex % 6 === index 
                    ? 'bg-primary w-7' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
