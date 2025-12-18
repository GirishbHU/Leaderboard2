import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Clock, BarChart3, Activity, Users, Trophy, Filter } from "lucide-react";

interface ActivityData {
  id: number;
  userId: string | null;
  activityName: string;
  category: string;
  timeSpentMinutes: number;
  date: string;
  description: string | null;
  userName?: string;
  userCountry?: string;
  userSector?: string;
}

interface ActivityStats {
  category: string;
  totalMinutes: number;
  count: number;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  country: string;
  sector: string;
  totalMinutes: number;
  activityCount: number;
  privacy: string;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const categoryColors: Record<string, string> = {
  Setup: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Content: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Networking: "bg-green-500/20 text-green-400 border-green-500/30",
  Learning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Admin: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Work: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Research: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Sales: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Finance: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Planning: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const countries = ["All", "USA", "India", "UK", "Germany", "France", "Japan", "Brazil", "Canada", "Australia", "Singapore", "Vietnam", "Armenia", "Hungary", "Qatar", "Bahrain", "Lebanon"];
const sectors = ["All", "Fintech", "Healthtech", "Edtech", "SaaS", "E-commerce", "AI", "Clean Energy", "Parking & Mobility", "Tax Planning", "Smart Home & IoT", "Enterprise Software", "Language Learning", "Logistics", "Government Tech", "Shipping & Freight"];

export default function Activities() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const limit = 20;

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/activities/categories"],
    queryFn: async () => {
      const res = await fetch("/api/activities/categories");
      return res.json() as Promise<string[]>;
    },
  });

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities", page, limit, categoryFilter, countryFilter, sectorFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (countryFilter !== "All") params.append("country", countryFilter);
      if (sectorFilter !== "All") params.append("sector", sectorFilter);
      
      const res = await fetch(`/api/activities?${params}`);
      return res.json() as Promise<{
        data: ActivityData[];
        total: number;
        page: number;
        totalPages: number;
      }>;
    },
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/activities/stats"],
    queryFn: async () => {
      const res = await fetch("/api/activities/stats");
      return res.json() as Promise<ActivityStats[]>;
    },
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/activities/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/activities/leaderboard");
      return res.json() as Promise<LeaderboardEntry[]>;
    },
  });

  const totalTime = statsData?.reduce((acc, s) => acc + s.totalMinutes, 0) || 0;
  const totalActivities = statsData?.reduce((acc, s) => acc + s.count, 0) || 0;

  const clearFilters = () => {
    setCategoryFilter("All");
    setCountryFilter("All");
    setSectorFilter("All");
    setPage(1);
  };

  const hasActiveFilters = categoryFilter !== "All" || countryFilter !== "All" || sectorFilter !== "All";

  return (
    <PageWithSidePanels>
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
          Activity Time Tracking
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-subtitle">
          Track startup activities with privacy-aware analytics and leaderboards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
                <div className="text-2xl font-bold" data-testid="text-total-activities">
                  {statsLoading ? <Skeleton className="h-8 w-16" /> : totalActivities}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Time</div>
                <div className="text-2xl font-bold" data-testid="text-total-time">
                  {statsLoading ? <Skeleton className="h-8 w-24" /> : formatTime(totalTime)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-500/20">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Categories</div>
                <div className="text-2xl font-bold" data-testid="text-total-categories">
                  {statsLoading ? <Skeleton className="h-8 w-12" /> : statsData?.length || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/20">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. per Activity</div>
                <div className="text-2xl font-bold" data-testid="text-avg-time">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    formatTime(Math.round(totalTime / (totalActivities || 1)))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="activities" data-testid="tab-activities">
            <Activity className="w-4 h-4 mr-2" />
            Activity Records
          </TabsTrigger>
          <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            Activity Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {categoriesData?.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Country</label>
                  <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c === "All" ? "All Countries" : c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Sector</label>
                  <Select value={sectorFilter} onValueChange={(v) => { setSectorFilter(v); setPage(1); }}>
                    <SelectTrigger data-testid="select-sector">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((s) => (
                        <SelectItem key={s} value={s}>{s === "All" ? "All Sectors" : s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full" data-testid="button-clear-filters">
                    Clear Filters
                  </Button>
                )}

                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium mb-3">Time by Category</h4>
                  {statsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {statsData
                        ?.sort((a, b) => b.totalMinutes - a.totalMinutes)
                        .slice(0, 6)
                        .map((stat) => (
                          <div
                            key={stat.category}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                            data-testid={`stat-category-${stat.category.toLowerCase()}`}
                          >
                            <Badge variant="outline" className={categoryColors[stat.category] || ""}>
                              {stat.category}
                            </Badge>
                            <span className="font-medium">{formatTime(stat.totalMinutes)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Activity Records</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span data-testid="text-pagination-info">
                    Page {activitiesData?.page || 1} of {activitiesData?.totalPages || 1}
                  </span>
                  <span>({activitiesData?.total || 0} total)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activitiesLoading ? (
                        [...Array(10)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        activitiesData?.data.map((activity, index) => (
                          <TableRow
                            key={activity.id}
                            className="hover:bg-muted/20 transition-colors"
                            data-testid={`row-activity-${activity.id}`}
                          >
                            <TableCell className="font-medium text-muted-foreground text-sm">
                              {(page - 1) * limit + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {activity.activityName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={categoryColors[activity.category] || ""}>
                                {activity.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div>{activity.userName || "—"}</div>
                              {activity.userCountry && (
                                <div className="text-xs text-muted-foreground">{activity.userCountry}</div>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {formatTime(activity.timeSpentMinutes)}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(activity.date)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, activitiesData?.totalPages || 1))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {(activitiesData?.totalPages || 0) > 5 && (
                      <>
                        <span className="px-2 text-muted-foreground">...</span>
                        <Button
                          variant={page === activitiesData?.totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(activitiesData?.totalPages || 1)}
                          data-testid="button-page-last"
                        >
                          {activitiesData?.totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(activitiesData?.totalPages || 1, p + 1))}
                    disabled={page === (activitiesData?.totalPages || 1)}
                    data-testid="button-next-page"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Activity Leaderboard
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Users who have opted in to public leaderboard visibility
              </p>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : leaderboardData && leaderboardData.length > 0 ? (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead className="text-right">Total Time</TableHead>
                        <TableHead className="text-right">Activities</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData.map((entry, index) => (
                        <TableRow
                          key={entry.userId}
                          className="hover:bg-muted/20 transition-colors"
                          data-testid={`row-leaderboard-${index + 1}`}
                        >
                          <TableCell>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                              index === 1 ? "bg-gray-400/20 text-gray-400" :
                              index === 2 ? "bg-orange-500/20 text-orange-500" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{entry.userName}</TableCell>
                          <TableCell>{entry.country}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {entry.sector}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatTime(entry.totalMinutes)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {entry.activityCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users have opted into the public leaderboard yet.</p>
                  <p className="text-sm mt-2">Users can enable this in their privacy settings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <BlogInsightsSection />
      </div>

      <div className="mt-8">
        <RotatingInsightsQuotes variant="default" />
      </div>
    </div>
    </PageWithSidePanels>
  );
}
