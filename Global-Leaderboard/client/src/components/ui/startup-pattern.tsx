import React, { useEffect, useState } from 'react';
import { 
  Lightbulb, Rocket, Gem, Briefcase, Zap, TrendingUp, Cpu, Globe,
  Palette, Megaphone, Target, TreeDeciduous, GraduationCap, Trophy, Crown, Medal,
  BarChart3, Sprout, Brush, Presentation, Leaf, Stars
} from 'lucide-react';

const UnicornIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
     <path 
       d="M19 8C19 8 16 7 14 8C12 9 11 11 11 14V17C11 17 9 17 8 16C7 15 7 13 7 13L4 12L9 11C9 11 10 7 12 5C14 3 16 2 16 2L17 4C17 4 20 5 20 8Z" 
       stroke="currentColor" 
       strokeWidth="1.5" 
       strokeLinecap="round" 
       strokeLinejoin="round"
     />
     <path d="M16 2L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
     <path d="M14 8C14 8 12.5 5 11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function StartupPattern() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.08] select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(var(--primary), 0.2) 0%, transparent 60%)`
      }} />

      {/* SHINY LIGHTS & STARS - Lightest Grey & Blue */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[5%] left-[15%] w-1 h-1 bg-blue-200 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
        <div className="absolute top-[25%] right-[10%] w-2 h-2 bg-gray-200 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-[15%] left-[20%] w-1.5 h-1.5 bg-blue-100 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse" />
        <div className="absolute bottom-[35%] right-[25%] w-1 h-1 bg-gray-100 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[50%] left-[5%] w-2 h-2 bg-blue-300/50 rounded-full blur-sm animate-pulse" />
      </div>

      {/* CONNECTING THE DOTS: A faint path connecting the journey */}
      <svg className="absolute inset-0 w-full h-full opacity-40" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}>
        <path 
          d="M 100,100 Q 400,200 600,100 T 900,300 T 500,500 T 200,600 T 800,800" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeDasharray="10 20"
          className="text-primary animate-pulse"
        />
      </svg>
      
      {/* LAYER 1: DEEP BACKGROUND (Slow Parallax) - Light Grey Theme */}
      <div className="absolute inset-0 transition-transform duration-100 ease-out text-muted-foreground/20" style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}>
        {/* Ideation */}
        <div className="absolute top-[10%] left-[10%] -rotate-12"><Lightbulb className="w-32 h-32 text-gray-300/30" /></div>
        {/* Growth */}
        <div className="absolute top-[40%] right-[10%] rotate-12"><TrendingUp className="w-40 h-40 text-blue-200/20" /></div>
        {/* Success */}
        <div className="absolute bottom-[10%] left-[30%] -rotate-6"><Trophy className="w-32 h-32 text-gray-300/30" /></div>
      </div>

      {/* LAYER 2: MID GROUND (Medium Parallax) - More Visible but subtle */}
      <div className="absolute inset-0 transition-transform duration-100 ease-out text-muted-foreground/30" style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}>
        {/* Stage 1: Ideas */}
        <div className="absolute top-[15%] left-[25%] rotate-12"><Palette className="w-12 h-12 text-primary/60" /></div>
        <div className="absolute top-[8%] left-[35%] -rotate-6"><Brush className="w-10 h-10 text-gray-400" /></div>
        <div className="absolute top-[20%] left-[5%] rotate-45"><Zap className="w-16 h-16 text-blue-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" /></div>
        
        {/* Stage 2: Market */}
        <div className="absolute top-[10%] right-[15%] rotate-45 animate-pulse"><Rocket className="w-24 h-24 text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]" /></div>
        <div className="absolute top-[25%] right-[25%] -rotate-12"><Megaphone className="w-14 h-14 text-gray-400" /></div>
        <div className="absolute top-[5%] right-[30%] rotate-12"><Target className="w-12 h-12 text-gray-300" /></div>

        {/* Stage 3: Scale */}
        <div className="absolute top-[50%] right-[10%] -rotate-6"><BarChart3 className="w-16 h-16 text-gray-400" /></div>
        <div className="absolute top-[40%] right-[40%] rotate-12"><Globe className="w-24 h-24 text-blue-200/40" /></div>
        <div className="absolute bottom-[40%] left-[40%] -rotate-12"><Cpu className="w-12 h-12 text-gray-300" /></div>

        {/* Stage 4: Leadership */}
        <div className="absolute bottom-[10%] left-[15%] -rotate-6"><TreeDeciduous className="w-20 h-20 text-primary/60" /></div>
        <div className="absolute bottom-[20%] left-[25%] rotate-12"><Sprout className="w-10 h-10 text-gray-400" /></div>
        <div className="absolute bottom-[10%] right-[15%] rotate-6"><Medal className="w-16 h-16 text-blue-300" /></div>
        <div className="absolute bottom-[5%] right-[25%]"><GraduationCap className="w-14 h-14 text-gray-300" /></div>
      </div>

      {/* LAYER 3: FOREGROUND FLOATERS (Fast Parallax - The "Unicorns & Magic") - Lightest Grey & Blue */}
      <div className="absolute inset-0 transition-transform duration-100 ease-out" style={{ transform: `translate(${mousePos.x * -50}px, ${mousePos.y * -50}px)` }}>
        {/* Hero Unicorn */}
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 rotate-12 opacity-80">
          <UnicornIcon className="w-32 h-32 text-primary drop-shadow-[0_0_25px_rgba(var(--primary),0.4)]" />
          <Crown className="absolute -top-8 -left-4 w-12 h-12 text-yellow-400/80 rotate-[-20deg]" />
        </div>

        {/* Scattered Unicorns - More of them! */}
        <div className="absolute top-[18%] left-[8%] -rotate-12 opacity-60"><UnicornIcon className="w-16 h-16 text-gray-300" /></div>
        <div className="absolute bottom-[30%] right-[12%] rotate-12 opacity-70"><UnicornIcon className="w-20 h-20 text-blue-200" /></div>
        <div className="absolute top-[65%] left-[12%] rotate-45 opacity-50"><UnicornIcon className="w-14 h-14 text-gray-200" /></div>
        <div className="absolute top-[25%] right-[8%] -rotate-12 opacity-40"><UnicornIcon className="w-10 h-10 text-gray-300" /></div>
        
        {/* Extra Unicorns as requested */}
        <div className="absolute bottom-[10%] left-[5%] rotate-6 opacity-30"><UnicornIcon className="w-12 h-12 text-blue-100" /></div>
        <div className="absolute top-[5%] right-[40%] -rotate-6 opacity-30"><UnicornIcon className="w-8 h-8 text-gray-100" /></div>

        {/* Magic Dust/Stars - Shiny Lights */}
        <div className="absolute top-[30%] left-[20%]"><Stars className="w-6 h-6 text-blue-300 animate-pulse" /></div>
        <div className="absolute top-[60%] right-[30%]"><Stars className="w-8 h-8 text-white animate-pulse" /></div>
        <div className="absolute bottom-[20%] left-[10%]"><Stars className="w-5 h-5 text-primary animate-pulse" /></div>
        <div className="absolute top-[15%] right-[40%]"><Stars className="w-4 h-4 text-blue-200 animate-pulse" /></div>
      </div>
    </div>
  );
}
