import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, AlertTriangle, BookOpen, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import type { BlogArticle, InsertBlogArticle } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const categories = ["AI", "Technology", "Leadership", "Business Strategy"];

export default function Admin() {
  const queryClient = useQueryClient();
  const [leaderboardFrozen, setLeaderboardFrozen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState<Partial<InsertBlogArticle>>({
    title: "",
    excerpt: "",
    content: "",
    category: "AI",
    linkedinUrl: "",
    featured: false,
    sortOrder: 0
  });

  const { data: articlesResponse, isLoading } = useQuery<{ data: BlogArticle[]; total: number }>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog?limit=100");
      return res.json();
    }
  });

  const { data: pricingStats } = useQuery<{ signupCount: number }>({
    queryKey: ["/api/pricing/dynamic-stats"],
    queryFn: async () => {
      const res = await fetch("/api/pricing/dynamic-stats");
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<InsertBlogArticle>) => {
      const res = await apiRequest("POST", "/api/blog", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogArticle> }) => {
      const res = await apiRequest("PUT", `/api/blog/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "AI",
      linkedinUrl: "",
      featured: false,
      sortOrder: 0
    });
    setEditingArticle(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (article: BlogArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category,
      linkedinUrl: article.linkedinUrl || "",
      featured: article.featured,
      sortOrder: article.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const articles = articlesResponse?.data || [];
  
  const fraudFlags = [
    { id: 1, user: "User #9821", reason: "Suspicious referral pattern", risk: "High", date: "2025-12-14" },
    { id: 2, user: "User #1123", reason: "Multiple IP logins", risk: "Medium", date: "2025-12-13" },
  ];

  return (
    <PageWithSidePanels>
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and controls.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pricingStats?.signupCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,592</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articlesResponse?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">All systems go</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Blog Articles</CardTitle>
            <CardDescription>Manage your blog content.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-article">
                <Plus className="h-4 w-4 mr-2" /> Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                    required
                    data-testid="input-article-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger data-testid="select-article-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the article"
                    rows={2}
                    data-testid="input-article-excerpt"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl || ""}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://www.linkedin.com/..."
                    data-testid="input-article-linkedin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Full Content (optional)</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full article content (for future on-site display)"
                    rows={6}
                    data-testid="input-article-content"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      data-testid="switch-article-featured"
                    />
                    <Label htmlFor="featured">Featured Article</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder || 0}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-20"
                      data-testid="input-article-sort"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-article"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {editingArticle ? "Update" : "Create"} Article
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate">{article.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{article.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {article.featured && <Badge>Featured</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleEdit(article)}
                            data-testid={`button-edit-${article.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this article?")) {
                                deleteMutation.mutate(article.id);
                              }
                            }}
                            data-testid={`button-delete-${article.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>Manage global settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="font-semibold">Freeze Leaderboard</div>
                <div className="text-sm text-muted-foreground">Stop all ranking updates temporarily</div>
              </div>
              <Switch 
                checked={leaderboardFrozen}
                onCheckedChange={setLeaderboardFrozen}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <div className="font-semibold">Maintenance Mode</div>
                <div className="text-sm text-muted-foreground">Disable user access for updates</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Flags</CardTitle>
            <CardDescription>Recent suspicious activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fraudFlags.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell className="font-medium">{flag.user}</TableCell>
                    <TableCell>{flag.reason}</TableCell>
                    <TableCell>
                      <Badge variant={flag.risk === "High" ? "destructive" : "secondary"}>
                        {flag.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageWithSidePanels>
  );
}
