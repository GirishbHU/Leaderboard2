import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X, Wallet, LayoutDashboard, Shield, Sparkles, Activity, UserCircle, LogOut, Home, Rocket, Briefcase, Award, BookOpen, Info, LogIn, ChevronDown, Calculator, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PreviewBanner } from "@/components/PreviewBanner";
import { CompositeBackground } from "@/components/composite-background";
import { useAuth } from "@/lib/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "pro");
    root.classList.add(theme);
  }, [theme]);
  
  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // PUBLIC menu items (for non-logged-in visitors)
  const publicMenuItems = [
    { label: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { label: "Startup Leaders", href: "/startup-leaders", icon: <Rocket className="w-4 h-4 mr-2" /> },
    { label: "Professionals' Zone", href: "/professionals-zone", icon: <Briefcase className="w-4 h-4 mr-2" /> },
    { label: "Honorary Pioneers", href: "/honorary-pioneers", icon: <Award className="w-4 h-4 mr-2" /> },
    { label: "Blog", href: "/blog", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { label: "Suggestions", href: "/suggestions", icon: <Lightbulb className="w-4 h-4 mr-2" /> },
  ];

  // About dropdown items
  const aboutMenuItems = [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/about/mission" },
    { label: "Contact", href: "/about/contact" },
  ];

  // Account menu items for logged-in subscribers
  const accountMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { label: "Referral Calculator", href: "/#referral-calculator", icon: <Calculator className="w-4 h-4 mr-2" /> },
    { label: "Activities", href: "/activities", icon: <Activity className="w-4 h-4 mr-2" /> },
    { label: "Wallet", href: "/wallet", icon: <Wallet className="w-4 h-4 mr-2" /> },
  ];

  // Admin nav item (shown separately for admins)
  const adminItem = { label: "Admin", href: "/admin", icon: <Shield className="w-4 h-4 mr-2" /> };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      <CustomCursor />
      
      {/* Global Composite Background - 4 category images at 18% opacity, tripled size */}
      <CompositeBackground />
      
      {/* Subtle Dynamic Background for All Themes - Made even more subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full mix-blend-multiply animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img src="/logo.png" alt="i2u.ai Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
               <span className="font-bold text-xl tracking-tight leading-none text-foreground group-hover:text-primary transition-colors duration-300">i2u.ai</span>
               <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">Ideas to Unicorns through AI!</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* PUBLIC MENU - Always visible */}
            {publicMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-300 px-3 py-2 rounded-full group ${
                  location === item.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/['\s]/g, '-')}`}
              >
                <span className="absolute inset-0 rounded-full bg-primary/15 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            
            {/* About Dropdown - Always visible */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-primary/5 text-muted-foreground hover:text-foreground" data-testid="nav-about-dropdown">
                  <span className="text-sm font-medium">About</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {aboutMenuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.href} 
                    onClick={() => setLocation(item.href)}
                    className="cursor-pointer"
                    data-testid={`menu-item-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth buttons - shown when not logged in */}
            {!isLoggedIn && (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-medium px-4 py-2 rounded-full" data-testid="nav-login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm font-medium px-4 py-2 rounded-full" data-testid="nav-register">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Account Menu - shown when logged in */}
            {isLoggedIn && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5" data-testid="button-account-menu">
                      <UserCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Account</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-amber-500/20 text-amber-600' : 'bg-primary/20 text-primary'}`}>
                        {isAdmin ? 'Admin' : 'Subscriber'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {accountMenuItems.map((item) => (
                      <DropdownMenuItem 
                        key={item.href} 
                        onClick={() => setLocation(item.href)}
                        className="cursor-pointer"
                        data-testid={`menu-item-${item.label.toLowerCase()}`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center cursor-pointer" data-testid="menu-item-register">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>Register Now</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                      data-testid="menu-item-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isAdmin && (
                  <Link
                    href={adminItem.href}
                    className={`relative flex items-center text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full group ${
                      location === adminItem.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="nav-admin"
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/15 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out" />
                    <span className="relative z-10 flex items-center">
                      {adminItem.icon}
                      {adminItem.label}
                    </span>
                  </Link>
                )}
              </>
            )}
            
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 rounded-full hover:bg-primary/5">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </nav>


          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="mr-2"
            >
               {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-background/95 backdrop-blur-xl">
            <nav className="flex flex-col space-y-2">
              {/* PUBLIC MENU - Always visible */}
              {publicMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-sm font-medium p-2 rounded-md transition-colors ${
                    location === item.href ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-border my-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">About</p>
                {aboutMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center text-sm font-medium p-2 rounded-md transition-colors text-muted-foreground hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Account Menu - shown when logged in */}
              {isLoggedIn && (
                <div className="border-t border-border my-2 pt-2">
                  <div className="flex items-center gap-2 px-2 mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Menu</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-amber-500/20 text-amber-600' : 'bg-primary/20 text-primary'}`}>
                      {isAdmin ? 'Admin' : 'Subscriber'}
                    </span>
                  </div>
                  {accountMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center text-sm font-medium p-2 rounded-md transition-colors ${
                        location === item.href ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link href={adminItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full mt-2 justify-start">
                        {adminItem.icon}
                        {adminItem.label}
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}

              {/* Auth buttons - shown when not logged in */}
              {!isLoggedIn && (
                <div className="flex gap-2 mt-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                    <Button className="w-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      
      <PreviewBanner />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background/50 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="i2u.ai Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg text-foreground">i2u.ai</span>
              </Link>
              <p className="text-sm text-muted-foreground">Ideas to Unicorns through AI!</p>
              <p className="text-sm text-muted-foreground mt-2">Empowering startups and professionals to achieve unicorn status.</p>
            </div>

            {/* Explore Section */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/startup-leaders" className="text-muted-foreground hover:text-primary transition-colors">Startup Leaders</Link></li>
                <li><Link href="/professionals-zone" className="text-muted-foreground hover:text-primary transition-colors">Professionals' Zone</Link></li>
                <li><Link href="/honorary-pioneers" className="text-muted-foreground hover:text-primary transition-colors">Honorary Pioneers</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/about/mission" className="text-muted-foreground hover:text-primary transition-colors">Our Mission</Link></li>
                <li><Link href="/about/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              </ul>
              <h4 className="font-semibold text-foreground mt-6 mb-2">Contact</h4>
              <p className="text-sm text-muted-foreground">admin@i2u.ai</p>
              <p className="text-sm text-muted-foreground">Bangalore, India</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 i2u.ai Global Leaderboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
