import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { CURRENT_USER } from "@/lib/mockData";
import { Wallet as WalletIcon, Download, Share2, Copy, Linkedin, Mail, MessageCircle } from "lucide-react";

const SHARE_MESSAGE = "Join i2u.ai - Transform your startup journey with AI-powered tools!";

export default function Wallet() {
  const user = CURRENT_USER;
  
  const referralUrl = `https://i2u.ai/register?ref=${user.referralCode}`;
  const fullMessage = `${SHARE_MESSAGE} Use my code: ${user.referralCode}`;
  
  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${encodeURIComponent(fullMessage)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${fullMessage} ${referralUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent("Join i2u.ai - Ideas to Unicorns!")}&body=${encodeURIComponent(`${fullMessage}\n\nSign up here: ${referralUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(fullMessage)}`,
    instagram: referralUrl,
  };
  
  // Mock transactions
  const transactions = [
    { id: "tx_123456", date: "2025-12-14", type: "Referral Earning", amount: 99.90, currency: "INR", status: "completed" },
    { id: "tx_123457", date: "2025-12-13", type: "Referral Earning", amount: 1.50, currency: "USD", status: "pending" },
    { id: "tx_123458", date: "2025-12-10", type: "Payment (Pro Max Ultra)", amount: -999, currency: "INR", status: "completed" },
    { id: "tx_123459", date: "2025-12-05", type: "Referral Earning", amount: 99.90, currency: "INR", status: "completed" },
  ];

  return (
    <PageWithSidePanels>
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings and payouts.</p>
        </div>
      </div>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* INR Wallet */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <span className="font-bold text-green-700 dark:text-green-300">₹</span>
                  </div>
                  INR Wallet
                </CardTitle>
                <CardDescription>Indian Rupee Balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                  <div className="text-4xl font-bold">₹{user.walletINR.available.toLocaleString()}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-900 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Pending: ₹{user.walletINR.pending.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Unlocks in 14 days</p>
                  </div>
                  <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">Withdraw</Button>
                </div>
              </CardContent>
            </Card>

            {/* USD Wallet */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="font-bold text-blue-700 dark:text-blue-300">$</span>
                  </div>
                  USD Wallet
                </CardTitle>
                <CardDescription>US Dollar Balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                  <div className="text-4xl font-bold">${user.walletUSD.available.toLocaleString()}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-900 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Pending: ${user.walletUSD.pending.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Unlocks in 14 days</p>
                  </div>
                  <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-100">Withdraw</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>Share your unique code to earn rewards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-muted rounded-lg">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Your Referral Code</h3>
                  <div className="flex items-center gap-2">
                    <code className="text-3xl font-mono font-bold tracking-wider">{user.referralCode}</code>
                    <Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(user.referralCode)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 bg-[#0077B5] hover:bg-[#006399] text-white border-none">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Button>
                  </a>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 bg-[#25D366] hover:bg-[#1da851] text-white border-none">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                  </a>
                  <a href={shareLinks.email}>
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Button>
                  </a>
                  <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 bg-[#1877F2] hover:bg-[#1466d2] text-white border-none">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
                    </Button>
                  </a>
                  <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-none">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> Instagram
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium mb-2">Pre-written message for sharing:</p>
                <p className="text-sm text-muted-foreground italic">"{fullMessage}"</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">How it works</h3>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div className="p-4 border rounded-lg">
                    <div className="font-bold mb-1">1. Share Code</div>
                    <p className="text-muted-foreground">Send your unique code to friends and colleagues.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-bold mb-1">2. They Register</div>
                    <p className="text-muted-foreground">They sign up using your code.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-bold mb-1">3. You Earn</div>
                    <p className="text-muted-foreground">Get 20% of their registration fee instantly.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent earnings and payouts.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
