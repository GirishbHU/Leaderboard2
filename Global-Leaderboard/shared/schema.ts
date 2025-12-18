import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoles = ["startup", "mentor", "enabler", "influencer", "facilitator", "investor", "professional", "job_seeker", "admin"] as const;
export const stakeholderTypes = ["ecosystem", "professional"] as const;
export const currencies = ["INR", "USD"] as const;
export const displayPreferences = ["real_name", "username", "anonymous", "fancy_username"] as const;
export const subscriptionTiers = ["Free", "Beginner", "Basic", "Advanced", "Professional", "Pro Max Ultra"] as const;
export const userStatuses = ["verified", "pending"] as const;
export const activityPrivacyOptions = ["private", "anonymous_aggregate", "public_leaderboard"] as const;
export const subscriptionStatuses = ["inactive", "pending_payment", "active_preview", "active_sandbox", "active_live"] as const;
export const planTypes = ["free", "preview", "basic", "premium", "enterprise"] as const;
export const paymentMethods = ["paypal", "cashfree", "manual_upi", "manual_bank"] as const;
export const paymentIntentStatuses = ["pending", "submitted", "verified", "failed", "expired"] as const;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  username: text("username"),
  password: text("password").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("startup"),
  stakeholderType: text("stakeholder_type").notNull().default("ecosystem"),
  country: text("country").notNull().default("India"),
  sector: text("sector"),
  currency: text("currency").notNull().default("INR"),
  displayPreference: text("display_preference").notNull().default("real_name"),
  displayName: text("display_name"),
  showOnLeaderboard: boolean("show_on_leaderboard").notNull().default(true),
  anonymousMode: boolean("anonymous_mode").notNull().default(false),
  companyName: text("company_name"),
  startupStage: text("startup_stage"),
  registrationNumber: serial("registration_number"),
  registrationDate: timestamp("registration_date").defaultNow(),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  referralCount: integer("referral_count").notNull().default(0),
  referralEarningsINR: real("referral_earnings_inr").notNull().default(0),
  referralEarningsUSD: real("referral_earnings_usd").notNull().default(0),
  showEarningsPublicly: boolean("show_earnings_publicly").notNull().default(true),
  activityPrivacy: text("activity_privacy").notNull().default("private"),
  walletINRAvailable: real("wallet_inr_available").notNull().default(0),
  walletINRPending: real("wallet_inr_pending").notNull().default(0),
  walletUSDAvailable: real("wallet_usd_available").notNull().default(0),
  walletUSDPending: real("wallet_usd_pending").notNull().default(0),
  leaderboardRank: integer("leaderboard_rank").notNull().default(0),
  percentile: real("percentile").notNull().default(0),
  subscriptionTier: text("subscription_tier").notNull().default("Free"),
  status: text("status").notNull().default("pending"),
  subscriptionStatus: text("subscription_status").notNull().default("inactive"),
  planType: text("plan_type").notNull().default("free"),
  paymentId: text("payment_id").unique(),
  paymentProvider: text("payment_provider"),
  paymentAmount: real("payment_amount"),
  paymentCurrency: text("payment_currency"),
  registrationFee: real("registration_fee"),
  registrationFeeCurrency: text("registration_fee_currency"),
  awaitingPaymentInr: boolean("awaiting_payment_inr").notNull().default(false),
  awaitingPaymentUsd: boolean("awaiting_payment_usd").notNull().default(false),
  paymentGlitchFlaggedAt: timestamp("payment_glitch_flagged_at"),
  paymentGlitchResolved: boolean("payment_glitch_resolved").notNull().default(false),
});

export const activityTimeTracking = pgTable("activity_time_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  activityName: text("activity_name").notNull(),
  category: text("category").notNull(),
  timeSpentMinutes: integer("time_spent_minutes").notNull(),
  date: timestamp("date").defaultNow(),
  description: text("description"),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").references(() => users.id),
  referredId: varchar("referred_id").references(() => users.id),
  earningsINR: real("earnings_inr").notNull().default(0),
  earningsUSD: real("earnings_usd").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pricingBrackets = pgTable("pricing_brackets", {
  id: serial("id").primaryKey(),
  stakeholderType: text("stakeholder_type").notNull(),
  currency: text("currency").notNull(),
  minSignups: integer("min_signups").notNull(),
  maxSignups: integer("max_signups"),
  amount: real("amount").notNull(),
  effectiveFrom: timestamp("effective_from").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const subscriptionTiersTable = pgTable("subscription_tiers", {
  id: serial("id").primaryKey(),
  tierCode: text("tier_code").notNull().unique(),
  name: text("name").notNull(),
  amountINR: real("amount_inr").notNull(),
  amountUSD: real("amount_usd").notNull(),
  features: text("features"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const paymentIntents = pgTable("payment_intents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  intentType: text("intent_type").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("pending"),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  transactionRef: text("transaction_ref"),
  providerOrderId: text("provider_order_id"),
  upiId: text("upi_id"),
  bankDetails: text("bank_details"),
  proofImageUrl: text("proof_image_url"),
  notes: text("notes"),
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentFollowups = pgTable("payment_followups", {
  id: serial("id").primaryKey(),
  paymentIntentId: integer("payment_intent_id").references(() => paymentIntents.id),
  userId: varchar("user_id").references(() => users.id),
  followupType: text("followup_type").notNull(),
  channel: text("channel").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  responseReceived: boolean("response_received").notNull().default(false),
  responseAt: timestamp("response_at"),
  notes: text("notes"),
  createdBy: varchar("created_by"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  registrationNumber: true,
  registrationDate: true,
});

export const insertActivitySchema = createInsertSchema(activityTimeTracking).omit({
  id: true,
  date: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPricingBracketSchema = createInsertSchema(pricingBrackets).omit({
  id: true,
  effectiveFrom: true,
});

export const insertSubscriptionTierSchema = createInsertSchema(subscriptionTiersTable).omit({
  id: true,
});

export const insertPaymentIntentSchema = createInsertSchema(paymentIntents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentFollowupSchema = createInsertSchema(paymentFollowups).omit({
  id: true,
  sentAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activityTimeTracking.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof walletTransactions.$inferSelect;
export type InsertPricingBracket = z.infer<typeof insertPricingBracketSchema>;
export type PricingBracket = typeof pricingBrackets.$inferSelect;
export type InsertSubscriptionTier = z.infer<typeof insertSubscriptionTierSchema>;
export type SubscriptionTier = typeof subscriptionTiersTable.$inferSelect;
export type InsertPaymentIntent = z.infer<typeof insertPaymentIntentSchema>;
export type PaymentIntent = typeof paymentIntents.$inferSelect;
export type InsertPaymentFollowup = z.infer<typeof insertPaymentFollowupSchema>;
export type PaymentFollowup = typeof paymentFollowups.$inferSelect;

export const blogCategories = ["AI", "Technology", "Leadership", "Business Strategy"] as const;

export const blogArticles = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: text("category").notNull().default("AI"),
  linkedinUrl: text("linkedin_url"),
  imageUrl: text("image_url"),
  publishedDate: timestamp("published_date").defaultNow(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertBlogArticleSchema = createInsertSchema(blogArticles).omit({
  id: true,
});

export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type BlogArticle = typeof blogArticles.$inferSelect;

export const suggestionCategories = ["Feature Request", "Improvement", "Bug Report", "Content Idea", "Partnership", "General Feedback"] as const;
export const suggestionStatuses = ["pending", "under_review", "approved", "implemented", "declined"] as const;
export const recognitionPeriods = ["hour", "day", "week", "month", "quarter", "half_year", "year"] as const;

export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  guestCountryCode: text("guest_country_code"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("General Feedback"),
  status: text("status").notNull().default("pending"),
  voteCount: integer("vote_count").notNull().default(0),
  rewardAmountInr: real("reward_amount_inr").notNull().default(0),
  rewardAmountUsd: real("reward_amount_usd").notNull().default(0),
  recognitionPeriod: text("recognition_period"),
  recognitionDate: timestamp("recognition_date"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suggestionVotes = pgTable("suggestion_votes", {
  id: serial("id").primaryKey(),
  suggestionId: integer("suggestion_id").references(() => suggestions.id),
  userId: varchar("user_id").references(() => users.id),
  voteType: text("vote_type").notNull().default("upvote"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reactionTypes = ["thumbs_up", "thumbs_down"] as const;

export const suggestionReactions = pgTable("suggestion_reactions", {
  id: serial("id").primaryKey(),
  suggestionId: integer("suggestion_id").references(() => suggestions.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  guestSessionId: text("guest_session_id"),
  reactionType: text("reaction_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suggestionComments = pgTable("suggestion_comments", {
  id: serial("id").primaryKey(),
  suggestionId: integer("suggestion_id").references(() => suggestions.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSuggestionVoteSchema = createInsertSchema(suggestionVotes).omit({
  id: true,
  createdAt: true,
});

export const insertSuggestionReactionSchema = createInsertSchema(suggestionReactions).omit({
  id: true,
  createdAt: true,
});

export const insertSuggestionCommentSchema = createInsertSchema(suggestionComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestionVote = z.infer<typeof insertSuggestionVoteSchema>;
export type SuggestionVote = typeof suggestionVotes.$inferSelect;
export type InsertSuggestionReaction = z.infer<typeof insertSuggestionReactionSchema>;
export type SuggestionReaction = typeof suggestionReactions.$inferSelect;
export type InsertSuggestionComment = z.infer<typeof insertSuggestionCommentSchema>;
export type SuggestionComment = typeof suggestionComments.$inferSelect;
