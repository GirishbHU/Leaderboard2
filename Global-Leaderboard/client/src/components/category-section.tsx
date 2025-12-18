import { ReactNode } from "react";
import { getCategoryImage, getCategoryCssKey } from "@/lib/categoryConfig";

interface CategorySectionProps {
  category: string;
  children: ReactNode;
  className?: string;
  showBackdrop?: boolean;
}

export function CategorySection({ 
  category, 
  children, 
  className = "",
  showBackdrop = true 
}: CategorySectionProps) {
  const image = getCategoryImage(category);
  
  return (
    <div className={`relative ${className}`}>
      {showBackdrop && (
        <div className="absolute inset-0 max-h-[20vh] overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface CategoryBackdropProps {
  category: string;
  className?: string;
  opacity?: number;
}

export function CategoryBackdrop({ 
  category, 
  className = "",
  opacity = 0.1 
}: CategoryBackdropProps) {
  const image = getCategoryImage(category);
  
  return (
    <div className={`absolute inset-0 max-h-[20vh] overflow-hidden pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${image})`,
          opacity 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}

interface CategoryHeaderProps {
  category: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function CategoryHeader({ 
  category, 
  title, 
  subtitle,
  className = "" 
}: CategoryHeaderProps) {
  const image = getCategoryImage(category);
  const cssKey = getCategoryCssKey(category);
  
  return (
    <div className={`relative overflow-hidden rounded-lg category-bg-${cssKey} ${className}`}>
      <div className="absolute inset-0 max-h-[20vh] overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>
      <div className="relative z-10 p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
