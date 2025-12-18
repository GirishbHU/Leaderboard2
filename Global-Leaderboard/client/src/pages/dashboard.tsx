import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Copy,
  Share2,
  MapPin,
  Briefcase,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  Activity,
  Clock,
  Eye,
  EyeOff,
  UserCircle,
  Settings,
  Twitter,
  Link2,
  FileText
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_USER, getLeaderboardContext, User } from "@/lib/mockData";
import { Link } from "wouter";
import { useAuth } from "@/lib/authContext";
import { AlertTriangle, CreditCard } from "lucide-react";
import { PendingPaymentCard } from "@/components/pending-payment-card";

interface UserActivity {
  id: number;
  userId: string | null;
  activityName: string;
  category: string;
  timeSpentMinutes: number;
  date: string;
  description: string | null;
}

interface ActivityLeaderboardEntry {
  userId: string;
  userName: string;
  country: string;
  sector: string;
  totalMinutes: number;
  activityCount: number;
  privacy: string;
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PrivacySettingsCard({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(user.showOnLeaderboard !== false);
  const [anonymousMode, setAnonymousMode] = useState(user.anonymousMode === true);

  const updatePrivacyMutation = useMutation({
    mutationFn: async (data: { displayName?: string; showOnLeaderboard?: boolean; anonymousMode?: boolean }) => {
      const res = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Saved!", description: "Your privacy settings have been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updatePrivacyMutation.mutate({ displayName, showOnLeaderboard, anonymousMode });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Privacy Settings
        </CardTitle>
        <CardDescription className="text-xs">Control how you appear publicly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Display Name (Optional)
          </label>
          <Input
            placeholder="Enter a fancy name or pseudonym"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-8 text-sm"
          />
          <p className="text-xs text-muted-foreground">Use this instead of your real name on leaderboards</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Show on Leaderboards
            </label>
            <p className="text-xs text-muted-foreground">Appear in public rankings</p>
          </div>
          <Switch
            checked={showOnLeaderboard}
            onCheckedChange={setShowOnLeaderboard}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Anonymous Mode
            </label>
            <p className="text-xs text-muted-foreground">Show as "Anonymous" everywhere</p>
          </div>
          <Switch
            checked={anonymousMode}
            onCheckedChange={setAnonymousMode}
          />
        </div>
        
        <Button 
          size="sm" 
          className="w-full" 
          onClick={handleSave}
          disabled={updatePrivacyMutation.isPending}
        >
          {updatePrivacyMutation.isPending ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { subscriptionStatus } = useAuth();
  const { toast } = useToast();
  const user = CURRENT_USER;
  const [contextUsers, setContextUsers] = useState<User[]>([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const [expandedRange, setExpandedRange] = useState(5); // Default +/- 5

  const { data: dbUser } = useQuery({
    queryKey: ["/api/leaderboard/db-user"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?page=1&limit=1");
      const data = await res.json();
      return data.data?.[0] as { id: string; name: string; country: string; sector: string } | undefined;
    },
  });

  const currentUserId = dbUser?.id;
  const activityUserName = dbUser?.name || "User";

  const { data: userActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities/user", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await fetch(`/api/activities/user/${currentUserId}`);
      return res.json() as Promise<UserActivity[]>;
    },
    enabled: !!currentUserId,
  });

  const totalActivityTime = userActivities?.reduce((acc, a) => acc + a.timeSpentMinutes, 0) || 0;

  const { data: activityLeaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/activities/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/activities/leaderboard?limit=50");
      return res.json() as Promise<ActivityLeaderboardEntry[]>;
    },
  });

  const userActivityRank = activityLeaderboard?.findIndex(e => e.userId === currentUserId);
  const userInLeaderboard = userActivityRank !== undefined && userActivityRank !== -1;

  useEffect(() => {
    const fetchContext = async () => {
      setLoadingContext(true);
      // Fetch +/- expandedRange
      const users = await getLeaderboardContext(user.leaderboardRank, expandedRange);
      setContextUsers(users);
      setLoadingContext(false);
    };
    fetchContext();
  }, [user.leaderboardRank, expandedRange]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const referralLink = `https://i2u.ai/register?ref=${user.referralCode}`;
  const promoMessage = `🚀 Join me on i2u.ai - Ideas to Unicorns through AI!

I'm part of an exclusive global community of founders, investors, and innovators building the future. 

✅ Connect with startup leaders worldwide
✅ Get ranked on the Global Leaderboard
✅ Access 224+ expert insights from industry pioneers
✅ Earn rewards through referrals

Use my referral link to join: ${referralLink}

#Startups #Innovation #AI #Entrepreneurship #i2uai`;

  const handleShare = (platform: string) => {
    let url = "";
    const shortMessage = `🚀 Join me on i2u.ai - Ideas to Unicorns through AI! Connect with startup leaders worldwide and get ranked on the Global Leaderboard. Use my referral link: ${referralLink}`;
    
    switch(platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shortMessage)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent("Join i2u.ai - Ideas to Unicorns through AI")}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shortMessage)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortMessage)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent("Join i2u.ai - Ideas to Unicorns through AI!")}&body=${encodeURIComponent(promoMessage)}`;
        break;
      case 'instagram': 
        navigator.clipboard.writeText(promoMessage);
        toast({ title: "Promo message copied!", description: "Open Instagram to share." });
        return;
    }
    if (url) {
      const width = 600;
      const height = 500;
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;
      window.open(url, 'share_popup', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copied!`, description: "Ready to paste anywhere." });
  };

  return (
    <PageWithSidePanels>
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 p-6"
    >
      {/* Payment Pending Card with all payment options */}
      {subscriptionStatus === "pending_payment" && (
        <motion.div variants={item}>
          <PendingPaymentCard />
        </motion.div>
      )}

      {/* Welcome Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name} <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{user.role}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/leaderboard">
            <Button variant="outline">Full Leaderboard</Button>
          </Link>
          <Link href="/wallet">
            <Button>Check Wallet</Button>
          </Link>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Global Rank</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">#{user.leaderboardRank}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top {user.percentile.toFixed(2)}% of all users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.referralCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active referrals
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings (INR)</CardTitle>
            <div className="font-bold text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">INR</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user.walletINR.available.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              + ₹{user.walletINR.pending.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings (USD)</CardTitle>
            <div className="font-bold text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">USD</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.walletUSD.available.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              + ${user.walletUSD.pending.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Leaderboard Context Widget */}
        <motion.div variants={item} className="col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Leaderboard Context</CardTitle>
                  <CardDescription>
                    Your position relative to others (+/- {expandedRange})
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExpandedRange(prev => Math.max(5, prev - 5))} disabled={expandedRange <= 5}>
                    Show Less
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setExpandedRange(prev => Math.min(50, prev + 5))}>
                    Show More
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingContext ? (
                 <div className="space-y-2">
                   {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-muted rounded animate-pulse" />)}
                 </div>
              ) : (
                <div className="space-y-1">
                   {/* Upper Fade */}
                   <div className="h-6 bg-gradient-to-b from-background to-transparent opacity-50" />
                   
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Refs</TableHead>
                        <TableHead className="text-right">Tier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contextUsers.map((u) => {
                        const isMe = u.id === user.id;
                        return (
                          <TableRow key={u.id} className={isMe ? "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary" : ""}>
                            <TableCell className="font-medium">#{u.leaderboardRank}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className={isMe ? "font-bold text-primary" : "font-medium"}>
                                  {isMe ? `${u.name} (You)` : u.name}
                                </span>
                                <span className="text-xs text-muted-foreground">{u.country} • {u.sector}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{u.referralCount}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-[10px]">{u.subscriptionTier}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                   </Table>

                   {/* Lower Fade */}
                   <div className="h-6 bg-gradient-to-t from-background to-transparent opacity-50" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile & Milestone Card */}
        <motion.div variants={item} className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Next Milestone</CardTitle>
              <CardDescription>
                You are 5 referrals away from unlocking the next tier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current: {user.subscriptionTier}</span>
                  <span className="font-semibold text-primary">Target: Top 200</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="bg-primary/5 p-4 rounded-lg flex flex-col items-center justify-between gap-4">
                <div className="text-center w-full">
                  <h4 className="font-semibold text-primary mb-1">Invite & Earn</h4>
                  
                  <div className="bg-background/50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Your Referral Link:</p>
                    <p className="font-mono text-sm text-foreground break-all select-all">{referralLink}</p>
                  </div>
                  
                  {/* Social Share Buttons */}
                  <p className="text-xs text-muted-foreground mb-2">Share on social media:</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button size="icon" variant="outline" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white border-none h-9 w-9" onClick={() => handleShare('whatsapp')} title="Share on WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="bg-[#0077b5] hover:bg-[#0077b5]/90 text-white border-none h-9 w-9" onClick={() => handleShare('linkedin')} title="Share on LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="bg-black hover:bg-gray-800 text-white border-none h-9 w-9" onClick={() => handleShare('twitter')} title="Share on X (Twitter)">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none h-9 w-9" onClick={() => handleShare('facebook')} title="Share on Facebook">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white border-none h-9 w-9" onClick={() => handleShare('instagram')} title="Copy for Instagram">
                      <Instagram className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="bg-gray-600 hover:bg-gray-700 text-white border-none h-9 w-9" onClick={() => handleShare('email')} title="Share via Email">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full mt-2 flex-wrap">
                  <Button size="sm" variant="secondary" className="gap-2 flex-1" onClick={() => copyToClipboard(referralLink, "Referral link")}>
                    <Link2 className="h-3 w-3" /> Copy Link
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 flex-1" onClick={() => copyToClipboard(promoMessage, "Promo message")}>
                    <FileText className="h-3 w-3" /> Copy Promo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-base">Your Profile</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{user.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" /> {user.country}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Badge variant="secondary" className="text-xs font-normal">
                      <Briefcase className="h-3 w-3 mr-1" /> {user.sector}
                   </Badge>
                   <Badge variant="outline" className="text-xs font-normal">
                      {user.currency}
                   </Badge>
                </div>
             </CardContent>
          </Card>

          <PrivacySettingsCard user={user} />
        </motion.div>
      </div>

      {/* My Activities Section */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Activity History
                </CardTitle>
                <CardDescription>
                  {activityUserName}'s recent activities • Total: {formatTime(totalActivityTime)}
                </CardDescription>
              </div>
              <Link href="/activities">
                <Button variant="outline" size="sm" data-testid="button-view-all-activities">
                  View All Activities
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : userActivities && userActivities.length > 0 ? (
              <div className="space-y-2">
                {userActivities.slice(0, 8).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    data-testid={`activity-item-${activity.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{activity.activityName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={categoryColors[activity.category] || ""}>
                        {activity.category}
                      </Badge>
                      <span className="font-mono text-sm font-medium">
                        {formatTime(activity.timeSpentMinutes)}
                      </span>
                    </div>
                  </div>
                ))}
                {userActivities.length > 8 && (
                  <div className="text-center pt-2 text-sm text-muted-foreground">
                    + {userActivities.length - 8} more activities
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No activities recorded yet.</p>
                <p className="text-sm mt-1">Your activity history will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Leaderboard Section */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Activity Leaderboard
                </CardTitle>
                <CardDescription>
                  {userInLeaderboard 
                    ? `You're ranked #${userActivityRank! + 1} on the activity leaderboard!`
                    : "Users who opted into public activity tracking"}
                </CardDescription>
              </div>
              <Link href="/activities">
                <Button variant="outline" size="sm" data-testid="button-view-full-leaderboard">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : activityLeaderboard && activityLeaderboard.length > 0 ? (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                      <TableHead className="text-right">Activities</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLeaderboard.slice(0, 10).map((entry, index) => {
                      const isCurrentUser = entry.userId === currentUserId;
                      return (
                        <TableRow
                          key={entry.userId}
                          className={isCurrentUser ? "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary" : "hover:bg-muted/20"}
                          data-testid={`activity-leaderboard-row-${index + 1}`}
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
                          <TableCell>
                            <div className="flex flex-col">
                              <span className={isCurrentUser ? "font-bold text-primary" : "font-medium"}>
                                {isCurrentUser ? `${entry.userName} (You)` : entry.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">{entry.country} • {entry.sector}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {formatTime(entry.totalMinutes)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {entry.activityCount}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No users on the activity leaderboard yet.</p>
                <p className="text-sm mt-1">Enable public leaderboard visibility in your privacy settings to appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <BlogInsightsSection />
      </motion.div>

      <motion.div variants={item} className="mt-8">
        <RotatingInsightsQuotes variant="default" />
      </motion.div>
    </motion.div>
    </PageWithSidePanels>
  );
}

