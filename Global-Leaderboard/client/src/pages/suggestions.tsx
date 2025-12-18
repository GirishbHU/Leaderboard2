import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { GlobalCounters } from "@/components/global-counters";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Calendar,
  Award,
  Send,
  User,
  Star,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Suggestion {
  id: number;
  userId: string | null;
  title: string;
  content: string;
  category: string;
  status: string;
  voteCount: number;
  rewardAmountInr: number;
  rewardAmountUsd: number;
  recognitionPeriod: string | null;
  recognitionDate: string | null;
  createdAt: string;
  userName?: string;
}

interface Comment {
  id: number;
  suggestionId: number;
  userId: string | null;
  guestName: string | null;
  content: string;
  createdAt: string;
  userName?: string;
}

interface ReactionCounts {
  thumbs_up: number;
  thumbs_down: number;
}

function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sessionId = localStorage.getItem("guestSessionId");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("guestSessionId", sessionId);
    }
    return sessionId;
  } catch {
    return "";
  }
}

const CATEGORIES = ["Feature Request", "Improvement", "Bug Report", "Content Idea", "Partnership", "General Feedback"];
const PERIODS = [
  { value: "hour", label: "This Hour" },
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "half_year", label: "This Half Year" },
  { value: "year", label: "This Year" },
  { value: "2_years", label: "2 Years" },
  { value: "3_years", label: "3 Years" },
  { value: "4_years", label: "4 Years" },
  { value: "5_years", label: "5 Years" },
  { value: "decade", label: "Decade" },
];

const COUNTRY_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+27", country: "South Africa" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+7", country: "Russia" },
  { code: "+82", country: "South Korea" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  under_review: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  approved: "bg-green-500/20 text-green-600 border-green-500/30",
  implemented: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  declined: "bg-red-500/20 text-red-600 border-red-500/30",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface SuggestionFormData {
  title: string;
  content: string;
  category: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountryCode: string;
}

function SuggestionCard({ suggestion, user, onVote }: { 
  suggestion: Suggestion; 
  user: any; 
  onVote: (id: number) => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [guestCommentName, setGuestCommentName] = useState("");
  const [reactions, setReactions] = useState<ReactionCounts>({ thumbs_up: 0, thumbs_down: 0 });
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const { data: commentsData, refetch: refetchComments } = useQuery<Comment[]>({
    queryKey: [`/api/suggestions/${suggestion.id}/comments`],
    queryFn: async () => {
      const res = await fetch(`/api/suggestions/${suggestion.id}/comments`);
      return res.json();
    },
    enabled: showComments,
  });

  useEffect(() => {
    const fetchReactions = async () => {
      const sessionId = getGuestSessionId();
      const res = await fetch(`/api/suggestions/${suggestion.id}/reactions?guestSessionId=${sessionId}`);
      const data = await res.json();
      setReactions(data.counts);
      setUserReaction(data.userReaction);
    };
    fetchReactions();
  }, [suggestion.id]);

  const reactMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      const sessionId = getGuestSessionId();
      const res = await fetch(`/api/suggestions/${suggestion.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reactionType, guestSessionId: sessionId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setReactions(data.counts);
      setUserReaction(data.reaction?.reactionType || null);
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async () => {
      const sessionId = getGuestSessionId();
      const res = await fetch(`/api/suggestions/${suggestion.id}/react`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ guestSessionId: sessionId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setReactions(data.counts);
      setUserReaction(null);
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/suggestions/${suggestion.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newComment,
          guestName: !user ? guestCommentName : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => {
      setNewComment("");
      setGuestCommentName("");
      queryClient.invalidateQueries({ queryKey: [`/api/suggestions/${suggestion.id}/comments`] });
      toast({ title: "Comment added!" });
    },
    onError: () => {
      toast({ title: "Failed to add comment", variant: "destructive" });
    },
  });

  const handleReaction = (type: string) => {
    if (userReaction === type) {
      removeReactionMutation.mutate();
    } else {
      reactMutation.mutate(type);
    }
  };

  const comments = commentsData || [];
  const totalReactions = reactions.thumbs_up + reactions.thumbs_down;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto py-2 px-3 ${userReaction === "thumbs_up" ? "bg-green-100 border-green-500" : ""}`}
            onClick={() => handleReaction("thumbs_up")}
            disabled={reactMutation.isPending || removeReactionMutation.isPending}
          >
            <ThumbsUp className={`h-4 w-4 ${userReaction === "thumbs_up" ? "text-green-600" : ""}`} />
            <span className="text-xs font-bold">{reactions.thumbs_up}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto py-2 px-3 ${userReaction === "thumbs_down" ? "bg-red-100 border-red-500" : ""}`}
            onClick={() => handleReaction("thumbs_down")}
            disabled={reactMutation.isPending || removeReactionMutation.isPending}
          >
            <ThumbsDown className={`h-4 w-4 ${userReaction === "thumbs_down" ? "text-red-600" : ""}`} />
            <span className="text-xs font-bold">{reactions.thumbs_down}</span>
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold">{suggestion.title}</h4>
            <Badge variant="secondary" className="text-xs">
              {suggestion.category}
            </Badge>
            <Badge variant="outline" className={statusColors[suggestion.status] || ""}>
              {suggestion.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {suggestion.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {suggestion.userName || "Anonymous"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(suggestion.createdAt)}
            </span>
            {(suggestion.rewardAmountInr > 0 || suggestion.rewardAmountUsd > 0) && (
              <span className="flex items-center gap-1 text-green-600">
                <Award className="h-3 w-3" />
                Rewarded: {suggestion.rewardAmountInr > 0 ? `₹${suggestion.rewardAmountInr}` : `$${suggestion.rewardAmountUsd}`}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto py-1 px-2 text-xs"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {comments.length > 0 ? `${comments.length} Comments` : "Comment"}
              {showComments ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t overflow-hidden"
              >
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{comment.userName || "Anonymous"}</span>
                        <span>•</span>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                  
                  <div className="space-y-2">
                    {!user && (
                      <Input
                        placeholder="Your name"
                        value={guestCommentName}
                        onChange={(e) => setGuestCommentName(e.target.value)}
                        className="text-sm"
                      />
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                        className="text-sm flex-1"
                      />
                      <Button 
                        size="sm"
                        onClick={() => commentMutation.mutate()}
                        disabled={!newComment.trim() || (!user && !guestCommentName.trim()) || commentMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function SuggestionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<Suggestion | null>(null);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [newSuggestion, setNewSuggestion] = useState<SuggestionFormData>({ 
    title: "", 
    content: "", 
    category: "General Feedback",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCountryCode: "+91"
  });

  const { data: suggestionsData, isLoading } = useQuery<{ data: Suggestion[]; total: number }>({
    queryKey: ["/api/suggestions"],
    queryFn: async () => {
      const res = await fetch("/api/suggestions?limit=50");
      return res.json();
    },
  });

  const { data: bestSuggestions } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions/best", selectedPeriod],
    queryFn: async () => {
      const res = await fetch(`/api/suggestions/best/${selectedPeriod}?limit=5`);
      return res.json();
    },
  });

  const { data: mySuggestions } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions/user"],
    queryFn: async () => {
      const res = await fetch("/api/suggestions/user", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SuggestionFormData) => {
      const payload: Record<string, string> = {
        title: data.title,
        content: data.content,
        category: data.category,
      };
      
      if (!user) {
        if (data.guestName) payload.guestName = data.guestName;
        if (contactMethod === "email" && data.guestEmail) {
          payload.guestEmail = data.guestEmail;
        } else if (contactMethod === "phone" && data.guestPhone) {
          payload.guestPhone = data.guestPhone;
          payload.guestCountryCode = data.guestCountryCode;
        }
      }
      
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Your suggestion has been submitted." });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      setIsDialogOpen(false);
      setNewSuggestion({ title: "", content: "", category: "General Feedback", guestName: "", guestEmail: "", guestPhone: "", guestCountryCode: "+91" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (suggestionId: number) => {
      const res = await fetch(`/api/suggestions/${suggestionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ voteType: "upvote" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Voted!", description: "Your vote has been recorded." });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions/best"] });
    },
    onError: (error: Error) => {
      toast({ title: "Cannot Vote", description: error.message, variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; content: string; category: string } }) => {
      const res = await fetch(`/api/suggestions/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Updated!", description: "Your suggestion has been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      setIsEditDialogOpen(false);
      setEditingSuggestion(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/suggestions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Deleted!", description: "Your suggestion has been removed." });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions/user"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const suggestions = suggestionsData?.data || [];
  const canSubmitGuest = !user && ((contactMethod === "email" && newSuggestion.guestEmail) || (contactMethod === "phone" && newSuggestion.guestPhone));
  const canSubmit = user || canSubmitGuest;

  return (
    <PageWithSidePanels>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              Suggestions & Ideas
            </h1>
            <p className="text-muted-foreground">
              Share your ideas and vote for the best suggestions. Top contributors earn rewards!
            </p>
            <DynamicPricingBanner showBenefits={false} compact={true} />
            <GlobalCounters variant="full" className="mt-2" showButton={true} />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Submit Suggestion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Share Your Idea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {!user && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Not registered? No problem! Just provide your contact info:</p>
                    <div>
                      <label className="text-sm font-medium">Your Name (Optional)</label>
                      <Input
                        placeholder="Enter your name"
                        value={newSuggestion.guestName}
                        onChange={(e) => setNewSuggestion(s => ({ ...s, guestName: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant={contactMethod === "email" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setContactMethod("email")}
                        className="gap-1"
                      >
                        <Mail className="h-3 w-3" /> Email
                      </Button>
                      <Button
                        variant={contactMethod === "phone" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setContactMethod("phone")}
                        className="gap-1"
                      >
                        <Phone className="h-3 w-3" /> Phone
                      </Button>
                    </div>
                    {contactMethod === "email" ? (
                      <div>
                        <label className="text-sm font-medium">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={newSuggestion.guestEmail}
                          onChange={(e) => setNewSuggestion(s => ({ ...s, guestEmail: e.target.value }))}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium">Phone Number *</label>
                        <div className="flex gap-2">
                          <Select 
                            value={newSuggestion.guestCountryCode} 
                            onValueChange={(v) => setNewSuggestion(s => ({ ...s, guestCountryCode: v }))}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRY_CODES.map(cc => (
                                <SelectItem key={cc.code} value={cc.code}>
                                  {cc.code} {cc.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="tel"
                            placeholder="Phone number"
                            className="flex-1"
                            value={newSuggestion.guestPhone}
                            onChange={(e) => setNewSuggestion(s => ({ ...s, guestPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={newSuggestion.category} 
                    onValueChange={(v) => setNewSuggestion(s => ({ ...s, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Brief title for your suggestion"
                    value={newSuggestion.title}
                    onChange={(e) => setNewSuggestion(s => ({ ...s, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your idea, suggestion, or feedback in detail..."
                    rows={5}
                    value={newSuggestion.content}
                    onChange={(e) => setNewSuggestion(s => ({ ...s, content: e.target.value }))}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => submitMutation.mutate(newSuggestion)}
                  disabled={!newSuggestion.title || !newSuggestion.content || !canSubmit || submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Suggestion"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {user && mySuggestions && mySuggestions.filter(s => s.status === "pending").length > 0 && (
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Your Pending Suggestions
              </CardTitle>
              <CardDescription>You can edit or delete these while they're still pending review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mySuggestions.filter(s => s.status === "pending").map((suggestion) => (
                  <div key={suggestion.id} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground">{suggestion.category} • {formatDate(suggestion.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSuggestion(suggestion);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this suggestion?")) {
                            deleteMutation.mutate(suggestion.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Suggestion</DialogTitle>
            </DialogHeader>
            {editingSuggestion && (
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={editingSuggestion.category} 
                    onValueChange={(v) => setEditingSuggestion(s => s ? { ...s, category: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingSuggestion.title}
                    onChange={(e) => setEditingSuggestion(s => s ? { ...s, title: e.target.value } : null)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={5}
                    value={editingSuggestion.content}
                    onChange={(e) => setEditingSuggestion(s => s ? { ...s, content: e.target.value } : null)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => editMutation.mutate({
                    id: editingSuggestion.id,
                    data: {
                      title: editingSuggestion.title,
                      content: editingSuggestion.content,
                      category: editingSuggestion.category,
                    }
                  })}
                  disabled={!editingSuggestion.title || !editingSuggestion.content || editMutation.isPending}
                >
                  {editMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <CardTitle>Best Suggestions</CardTitle>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIODS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardDescription>Top-voted suggestions for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {bestSuggestions && bestSuggestions.length > 0 ? (
              <div className="space-y-3">
                {bestSuggestions.slice(0, 5).map((suggestion, index) => (
                  <div 
                    key={suggestion.id} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border"
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? "bg-yellow-500 text-yellow-900" : 
                      index === 1 ? "bg-gray-300 text-gray-700" :
                      index === 2 ? "bg-amber-600 text-amber-100" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        by {suggestion.userName || "Anonymous"} • {suggestion.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {suggestion.voteCount}
                      </Badge>
                      {suggestion.recognitionPeriod && (
                        <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                          <Award className="h-3 w-3 mr-1" />
                          Best of {suggestion.recognitionPeriod}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No suggestions yet for this period.</p>
                <p className="text-sm">Be the first to share an idea!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Suggestions</CardTitle>
            <CardDescription>Browse and vote for ideas from the community</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <SuggestionCard 
                    key={suggestion.id}
                    suggestion={suggestion}
                    user={user}
                    onVote={(id) => voteMutation.mutate(id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
                <p className="text-sm mb-4">Be the first to share your ideas with the community!</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit First Suggestion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <BlogInsightsSection />
      </motion.div>
    </PageWithSidePanels>
  );
}
