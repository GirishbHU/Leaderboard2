import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { GlobalCounters } from "@/components/global-counters";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Filter, Trophy, Crown, Medal, ArrowUp, ArrowDown, Target, ListOrdered, Plus, Minus, ChevronDown, Rocket, MapPin, Briefcase, Globe, X, PlusCircle, TrendingUp, Gem, Users, Zap, Activity } from "lucide-react";
import { getLeaderboard, getLeaderboardContext, COUNTRIES, SECTORS, User, CURRENT_USER } from "@/lib/mockData";
import { ShareAchievement } from "@/components/ShareAchievement";

type ViewMode = "top" | "context";

// Smart Tab Configuration
type TabConfig = {
  id: string;
  label: string;
  icon: React.ReactNode;
  mode: ViewMode;
  color?: string; // For custom tab styling
};

const AVAILABLE_VIEWS: Record<string, TabConfig> = {
  'mine': { id: 'mine', label: 'My Position', icon: <Target className="w-4 h-4 mr-2" />, mode: 'context' },
  'global': { id: 'global', label: 'Global Top', icon: <Globe className="w-4 h-4 mr-2" />, mode: 'top' },
  'regional': { id: 'regional', label: 'Regional Top', icon: <MapPin className="w-4 h-4 mr-2" />, mode: 'top' },
  'sector': { id: 'sector', label: 'Sector Leaders', icon: <Briefcase className="w-4 h-4 mr-2" />, mode: 'top' },
  'activity': { id: 'activity', label: 'Activity Leaders', icon: <Activity className="w-4 h-4 mr-2" />, mode: 'top', color: 'text-blue-500' },
  // New Smart Variants
  'rising': { id: 'rising', label: 'Rising Stars', icon: <TrendingUp className="w-4 h-4 mr-2" />, mode: 'top', color: 'text-orange-500' },
  'unicorns': { id: 'unicorns', label: 'Unicorn Club', icon: <Gem className="w-4 h-4 mr-2" />, mode: 'top', color: 'text-purple-500' },
  'network': { id: 'network', label: 'My Network', icon: <Users className="w-4 h-4 mr-2" />, mode: 'context' },
  'jumps': { id: 'jumps', label: 'Big Movers', icon: <Zap className="w-4 h-4 mr-2" />, mode: 'top', color: 'text-yellow-500' },
};

export default function Leaderboard() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Tab/View Control
  // Defaulting to "mine" (My Position) as requested
  const [activeTab, setActiveTab] = useState<string>("mine");
  const [visibleTabs, setVisibleTabs] = useState<string[]>(['mine', 'global', 'regional', 'sector', 'activity']);
  const [viewMode, setViewMode] = useState<ViewMode>("context");
  const [contextRange, setContextRange] = useState(50);
  
  // Filters
  const [country, setCountry] = useState("All");
  const [sector, setSector] = useState("All");
  const [search, setSearch] = useState("");

  // Handle Tab Change & Logic
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);

    const config = AVAILABLE_VIEWS[value];
    if (!config) return;

    setViewMode(config.mode);

    // Smart Filter Logic
    switch (value) {
      case "global":
        setCountry("All");
        setSector("All");
        break;
      case "regional":
        setCountry(CURRENT_USER.country);
        setSector("All");
        break;
      case "sector":
        setCountry("All");
        setSector(CURRENT_USER.sector);
        break;
      case "mine":
      case "network":
        // Context modes don't typically use the main filters
        break;
      case "unicorns":
        // Mock logic: Show top but maybe we'd filter by tier in real app
        setCountry("All");
        setSector("All");
        break;
      case "activity":
        // Activity leaderboard - shows users ranked by activity time
        setCountry("All");
        setSector("All");
        break;
    }
  };

  const addTab = (tabId: string) => {
    if (!visibleTabs.includes(tabId)) {
      setVisibleTabs([...visibleTabs, tabId]);
    }
    handleTabChange(tabId);
  };

  const removeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent tab activation
    const newTabs = visibleTabs.filter(id => id !== tabId);
    setVisibleTabs(newTabs);
    
    // If we removed the active tab, switch to the first one or "mine"
    if (activeTab === tabId) {
      handleTabChange(newTabs[0] || 'mine');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (viewMode === "top") {
        const res = await getLeaderboard(page, 10, country, sector);
        setData(res.data);
        setTotalPages(res.totalPages);
      } else {
        // Context Mode
        const contextData = await getLeaderboardContext(CURRENT_USER.leaderboardRank, contextRange);
        setData(contextData);
        setTotalPages(1); // Single page view for context
      }
      setLoading(false);
    };
    fetchData();
  }, [page, country, sector, viewMode, contextRange, activeTab]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-bold text-muted-foreground">#{rank}</span>;
  };

  const formatCurrency = (amount: number, currency: string) => {
     return currency === 'INR' 
        ? `₹${amount.toLocaleString()}` 
        : `$${amount.toLocaleString()}`;
  }

  return (
    <PageWithSidePanels>
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Global Leaderboard 
            <span className="hidden pro:inline-flex relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </h1>
          <p className="text-muted-foreground">Top performing startups and enablers worldwide.</p>
          <p className="text-sm text-muted-foreground/70 mt-1 italic">
            Registrants from earlier pivots (anonymized). Rankings will be based on registered member activity and engagement.
          </p>
        </div>
      </div>

      <GlobalCounters variant="full" showButton={true} />

      {/* SMART TAB SYSTEM */}
      <div className="flex items-center gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full justify-start h-auto p-1 bg-transparent gap-2">
            
            <AnimatePresence>
              {visibleTabs.map((tabId) => {
                const tab = AVAILABLE_VIEWS[tabId];
                return (
                  <motion.div
                    key={tabId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsTrigger 
                      value={tabId} 
                      className={`
                        relative group flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm 
                        data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary
                        hover:bg-accent/50 transition-all duration-300
                      `}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      
                      {/* Close/Remove Button (Hover Only, except 'mine') */}
                      {tabId !== 'mine' && (
                        <span 
                          onClick={(e) => removeTab(e, tabId)}
                          className="ml-2 p-0.5 rounded-full hover:bg-black/20 text-current opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </TabsTrigger>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* "Add View" Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border border-dashed border-muted-foreground/50 hover:border-primary hover:text-primary p-0 bg-transparent">
                  <PlusCircle className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Add Smart View</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(AVAILABLE_VIEWS).filter(v => !visibleTabs.includes(v.id)).map((view) => (
                  <DropdownMenuItem key={view.id} onClick={() => addTab(view.id)}>
                    {view.icon}
                    <span className="ml-2">{view.label}</span>
                  </DropdownMenuItem>
                ))}
                {Object.values(AVAILABLE_VIEWS).filter(v => !visibleTabs.includes(v.id)).length === 0 && (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    All views added
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </TabsList>
        </Tabs>
      </div>

      {/* Filters & Controls */}
      <Card className="bg-card/40 backdrop-blur-md border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {viewMode === "top" ? (
              <>
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name..." 
                    className="pl-8 bg-background/50 border-input focus-visible:ring-primary/50" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Select value={country} onValueChange={(val) => { 
                      setCountry(val); 
                      // If user manually changes filter, maybe we shouldn't switch tab, just update filter
                    }}>
                    <SelectTrigger className="w-[160px] bg-background/50 border-input">
                        <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Countries</SelectItem>
                        {COUNTRIES.slice(0, 10).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>

                    <Select value={sector} onValueChange={(val) => { 
                      setSector(val); 
                    }}>
                    <SelectTrigger className="w-[160px] bg-background/50 border-input">
                        <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Sectors</SelectItem>
                        {SECTORS.slice(0, 10).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>

                    <Button variant="outline" className="border-input hover:bg-accent" onClick={() => {
                      setCountry("All");
                      setSector("All");
                      setSearch("");
                    }}>
                    <Filter className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>
              </>
            ) : (
                // Context Mode Controls
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                           <Button 
                             variant="outline" 
                             size="sm" 
                             onClick={() => setContextRange(prev => Math.max(50, prev - 50))}
                             disabled={contextRange <= 50}
                             className="gap-1 border-input hover:bg-accent"
                           >
                             <Minus className="h-3 w-3" /> Less
                           </Button>
                           <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
                             ±{contextRange.toLocaleString()}
                           </Badge>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             onClick={() => setContextRange(prev => prev + 50)}
                             className="gap-1 border-input hover:bg-accent"
                           >
                             <Plus className="h-3 w-3" /> More
                           </Button>
                        </div>

                        <div className="h-6 w-px bg-border hidden md:block" />

                        <div className="flex items-center gap-2">
                            {/* Short Range Buttons */}
                            {[50, 100, 250, 500].map((range) => (
                                <Button 
                                    key={range}
                                    variant={contextRange === range ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setContextRange(range)}
                                    className={`h-7 px-2 text-xs hidden sm:inline-flex ${contextRange === range ? "bg-accent" : "hover:bg-accent/50"}`}
                                >
                                    ±{range}
                                </Button>
                            ))}

                            {/* Massive Jump Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1 border-input hover:bg-accent">
                                   <Rocket className="w-3 h-3 text-primary" />
                                   Massive Jumps
                                   <ChevronDown className="w-3 h-3 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {[1000, 2500, 5000, 10000].map((range) => (
                                  <DropdownMenuItem key={range} onClick={() => setContextRange(range)}>
                                    ±{range.toLocaleString()}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={() => addTab('global')} className="border-input hover:bg-accent">
                        View Top Ranked
                    </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/40 backdrop-blur-md border-border overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[80px] text-muted-foreground">Rank</TableHead>
                <TableHead className="text-muted-foreground">User / Entity</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Country & Sector</TableHead>
                <TableHead className="text-right text-muted-foreground">Referrals</TableHead>
                <TableHead className="text-right text-muted-foreground">Earnings</TableHead>
                <TableHead className="text-right text-muted-foreground">Tier</TableHead>
                <TableHead className="w-[50px] text-muted-foreground">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton loading state
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><div className="h-6 w-6 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-6 w-32 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-6 w-24 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-6 w-12 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell><div className="h-6 w-16 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell><div className="h-6 w-20 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell><div className="h-6 w-6 bg-muted rounded animate-pulse mx-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : (
                data.map((user) => {
                  const isMe = user.id === CURRENT_USER.id;
                  return (
                    <TableRow 
                        key={user.id} 
                        className={`transition-colors border-border ${isMe ? "bg-primary/10 hover:bg-primary/20 border-l-4 border-l-primary" : "hover:bg-muted/30"}`}
                    >
                        <TableCell className="font-medium">
                        <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(user.leaderboardRank)}
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <span className={`font-semibold ${isMe ? "text-primary" : "text-foreground"}`}>
                            {isMe ? `${user.name} (You)` : (user.displayPreference === 'anonymous' ? 'Anonymous User' : user.name)}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-medium">{user.country}</span>
                            </div>
                            <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0 h-5 bg-muted text-muted-foreground hover:bg-muted/80">
                            {user.sector}
                            </Badge>
                        </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-muted-foreground">
                        {user.referralCount}
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                            {/* Updated Earnings Display */}
                            <span className="text-sm font-semibold text-green-500 dark:text-green-400">
                                {user.showEarningsPublicly ? (
                                    <>
                                        {formatCurrency(user.referralEarningsINR, 'INR')} 
                                        <span className="text-muted-foreground mx-1 text-xs">+</span> 
                                        {formatCurrency(user.referralEarningsUSD, 'USD')}
                                    </>
                                ) : (
                                    <span className="text-muted-foreground italic text-xs">Private</span>
                                )}
                            </span>
                        </div>
                        </TableCell>
                        <TableCell className="text-right">
                        <Badge variant={
                            user.subscriptionTier === 'Pro Max Ultra' ? 'default' : 
                            user.subscriptionTier === 'Advanced' ? 'secondary' : 'outline'
                        } className={
                             user.subscriptionTier === 'Pro Max Ultra' ? "bg-primary hover:bg-primary/80" : 
                             ""
                        }>
                            {user.subscriptionTier}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <ShareAchievement
                            rank={user.leaderboardRank}
                            name={user.name}
                            country={user.country}
                            sector={user.sector}
                            tier={user.subscriptionTier}
                            isCurrentUser={isMe}
                          />
                        </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination - Only show in Top mode */}
      {viewMode === "top" && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
            <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="border-input hover:bg-accent"
            >
                Previous
            </Button>
            <Button 
                variant="outline" 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="border-input hover:bg-accent"
            >
                Next
            </Button>
            </div>
        </div>
      )}

       {/* Context Mode Footer Info */}
       {viewMode === "context" && (
           <div className="text-center text-sm text-muted-foreground">
               Showing users ranked ±{contextRange.toLocaleString()} around your position (#{CURRENT_USER.leaderboardRank})
           </div>
       )}
    </div>
    </PageWithSidePanels>
  );
}
