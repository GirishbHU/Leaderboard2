import { db } from "./db";
import { eq, desc, asc, and, gte, lte, sql, or, ne, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  users,
  activityTimeTracking,
  referrals,
  walletTransactions,
  blogArticles,
  pricingBrackets,
  subscriptionTiersTable,
  paymentIntents,
  paymentFollowups,
  suggestions,
  suggestionVotes,
  suggestionReactions,
  suggestionComments,
  type User,
  type InsertUser,
  type Activity,
  type InsertActivity,
  type Referral,
  type InsertReferral,
  type Transaction,
  type InsertTransaction,
  type BlogArticle,
  type InsertBlogArticle,
  type PricingBracket,
  type InsertPricingBracket,
  type SubscriptionTier,
  type InsertSubscriptionTier,
  type PaymentIntent,
  type InsertPaymentIntent,
  type PaymentFollowup,
  type InsertPaymentFollowup,
  type Suggestion,
  type InsertSuggestion,
  type SuggestionVote,
  type InsertSuggestionVote,
  type SuggestionReaction,
  type InsertSuggestionReaction,
  type SuggestionComment,
  type InsertSuggestionComment,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  getUserByPaymentId(paymentId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  
  getLeaderboard(page: number, limit: number, country?: string, sector?: string): Promise<{ data: User[]; total: number }>;
  getLeaderboardContext(centerRank: number, range: number): Promise<User[]>;
  
  getActivities(page: number, limit: number, filters?: { category?: string; country?: string; sector?: string }): Promise<{ data: (Activity & { userName?: string; userCountry?: string; userSector?: string })[]; total: number }>;
  getActivitiesByUser(userId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivityStats(onlyConsented?: boolean): Promise<{ category: string; totalMinutes: number; count: number }[]>;
  getActivityLeaderboard(page: number, limit: number): Promise<{ userId: string; userName: string; country: string; sector: string; totalMinutes: number; activityCount: number; privacy: string }[]>;
  getCategories(): Promise<string[]>;
  
  getReferrals(userId: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  getBlogArticles(page?: number, limit?: number, category?: string): Promise<{ data: BlogArticle[]; total: number }>;
  getBlogArticle(id: number): Promise<BlogArticle | undefined>;
  createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle>;
  updateBlogArticle(id: number, data: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined>;
  deleteBlogArticle(id: number): Promise<boolean>;
  getFeaturedArticles(limit?: number): Promise<BlogArticle[]>;
  
  getPricingBrackets(stakeholderType?: string): Promise<PricingBracket[]>;
  getCurrentPrice(stakeholderType: string, currency: string): Promise<{ amount: number; bracket: PricingBracket | null }>;
  getSignupCount(stakeholderType: string): Promise<number>;
  getEcosystemSignupCount(): Promise<number>;
  getProfessionalSignupCount(): Promise<number>;
  
  getSubscriptionTiers(): Promise<SubscriptionTier[]>;
  getSubscriptionTier(tierCode: string): Promise<SubscriptionTier | undefined>;
  
  createPaymentIntent(intent: InsertPaymentIntent): Promise<PaymentIntent>;
  getPaymentIntent(id: number): Promise<PaymentIntent | undefined>;
  getPaymentIntentsByUser(userId: string): Promise<PaymentIntent[]>;
  getPendingPaymentIntents(): Promise<(PaymentIntent & { userName?: string; userEmail?: string; userPhone?: string })[]>;
  updatePaymentIntent(id: number, data: Partial<InsertPaymentIntent>): Promise<PaymentIntent | undefined>;
  
  createPaymentFollowup(followup: InsertPaymentFollowup): Promise<PaymentFollowup>;
  getPaymentFollowups(paymentIntentId: number): Promise<PaymentFollowup[]>;
  
  addReaction(suggestionId: number, reactionType: string, userId?: string, guestSessionId?: string): Promise<SuggestionReaction | null>;
  removeReaction(suggestionId: number, userId?: string, guestSessionId?: string): Promise<boolean>;
  getReactionCounts(suggestionId: number): Promise<{ thumbs_up: number; thumbs_down: number }>;
  getUserReaction(suggestionId: number, userId?: string, guestSessionId?: string): Promise<SuggestionReaction | null>;
  
  addComment(data: InsertSuggestionComment): Promise<SuggestionComment>;
  getComments(suggestionId: number): Promise<(SuggestionComment & { userName?: string })[]>;
  deleteComment(id: number, userId?: string): Promise<boolean>;
  
  seedDatabase(): Promise<void>;
  seedPricingData(): Promise<void>;
  ensureAdminExists(): Promise<void>;
  cleanupMockUsers(): Promise<number>;
  fixProfessionalStakeholderTypes(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code));
    return user;
  }

  async getUserByPaymentId(paymentId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.paymentId, paymentId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getLeaderboard(page: number = 1, limit: number = 10, country?: string, sector?: string): Promise<{ data: User[]; total: number }> {
    const conditions = [];
    
    conditions.push(or(eq(users.showOnLeaderboard, true), isNull(users.showOnLeaderboard)));
    
    if (country && country !== "All") {
      conditions.push(eq(users.country, country));
    }
    if (sector && sector !== "All") {
      conditions.push(eq(users.sector, sector));
    }

    const offset = (page - 1) * limit;
    const rawData = await db.select().from(users)
      .where(and(...conditions))
      .orderBy(asc(users.leaderboardRank))
      .limit(limit)
      .offset(offset);
    
    const data = rawData.map(user => ({
      ...user,
      name: user.anonymousMode ? "Anonymous" : (user.displayName || user.name),
    }));
    
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));
    
    return { data, total: Number(count) };
  }

  async getLeaderboardContext(centerRank: number, range: number = 5): Promise<User[]> {
    const minRank = Math.max(1, centerRank - range);
    const maxRank = centerRank + range;
    
    const rawData = await db.select().from(users)
      .where(and(
        gte(users.leaderboardRank, minRank), 
        lte(users.leaderboardRank, maxRank),
        or(eq(users.showOnLeaderboard, true), isNull(users.showOnLeaderboard))
      ))
      .orderBy(asc(users.leaderboardRank));
    
    return rawData.map(user => ({
      ...user,
      name: user.anonymousMode ? "Anonymous" : (user.displayName || user.name),
    }));
  }

  async getActivities(page: number = 1, limit: number = 50, filters?: { category?: string; country?: string; sector?: string }): Promise<{ data: (Activity & { userName?: string; userCountry?: string; userSector?: string })[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select({
      id: activityTimeTracking.id,
      userId: activityTimeTracking.userId,
      activityName: activityTimeTracking.activityName,
      category: activityTimeTracking.category,
      timeSpentMinutes: activityTimeTracking.timeSpentMinutes,
      date: activityTimeTracking.date,
      description: activityTimeTracking.description,
      userName: users.name,
      userCountry: users.country,
      userSector: users.sector,
    })
      .from(activityTimeTracking)
      .leftJoin(users, eq(activityTimeTracking.userId, users.id));
    
    const conditions = [];
    if (filters?.category && filters.category !== "All") {
      conditions.push(eq(activityTimeTracking.category, filters.category));
    }
    if (filters?.country && filters.country !== "All") {
      conditions.push(eq(users.country, filters.country));
    }
    if (filters?.sector && filters.sector !== "All") {
      conditions.push(eq(users.sector, filters.sector));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const data = await query.orderBy(desc(activityTimeTracking.date)).limit(limit).offset(offset);
    
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(activityTimeTracking);
    
    return { data, total: Number(count) };
  }

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    return db.select().from(activityTimeTracking)
      .where(eq(activityTimeTracking.userId, userId))
      .orderBy(desc(activityTimeTracking.date));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [created] = await db.insert(activityTimeTracking).values(activity).returning();
    return created;
  }

  async getActivityStats(onlyConsented: boolean = false): Promise<{ category: string; totalMinutes: number; count: number }[]> {
    let query = db.select({
      category: activityTimeTracking.category,
      totalMinutes: sql<number>`sum(${activityTimeTracking.timeSpentMinutes})`,
      count: sql<number>`count(*)`,
    })
      .from(activityTimeTracking);
    
    if (onlyConsented) {
      query = query.leftJoin(users, eq(activityTimeTracking.userId, users.id))
        .where(or(eq(users.activityPrivacy, "anonymous_aggregate"), eq(users.activityPrivacy, "public_leaderboard"))) as any;
    }
    
    const stats = await query.groupBy(activityTimeTracking.category);
    
    return stats.map((s: any) => ({
      category: s.category,
      totalMinutes: Number(s.totalMinutes),
      count: Number(s.count),
    }));
  }

  async getActivityLeaderboard(page: number = 1, limit: number = 20): Promise<{ userId: string; userName: string; country: string; sector: string; totalMinutes: number; activityCount: number; privacy: string }[]> {
    const offset = (page - 1) * limit;
    
    const data = await db.select({
      userId: users.id,
      userName: users.name,
      displayName: users.displayName,
      anonymousMode: users.anonymousMode,
      country: users.country,
      sector: users.sector,
      privacy: users.activityPrivacy,
      totalMinutes: sql<number>`sum(${activityTimeTracking.timeSpentMinutes})`,
      activityCount: sql<number>`count(${activityTimeTracking.id})`,
    })
      .from(users)
      .leftJoin(activityTimeTracking, eq(users.id, activityTimeTracking.userId))
      .where(and(
        eq(users.activityPrivacy, "public_leaderboard"),
        or(eq(users.showOnLeaderboard, true), isNull(users.showOnLeaderboard))
      ))
      .groupBy(users.id, users.name, users.displayName, users.anonymousMode, users.country, users.sector, users.activityPrivacy)
      .orderBy(sql`sum(${activityTimeTracking.timeSpentMinutes}) DESC`)
      .limit(limit).offset(offset);
    
    return data.map(d => ({
      userId: d.userId,
      userName: d.anonymousMode ? "Anonymous" : (d.displayName || d.userName),
      country: d.country,
      sector: d.sector || "",
      privacy: d.privacy,
      totalMinutes: Number(d.totalMinutes) || 0,
      activityCount: Number(d.activityCount) || 0,
    }));
  }

  async getCategories(): Promise<string[]> {
    const cats = await db.selectDistinct({ category: activityTimeTracking.category }).from(activityTimeTracking);
    return cats.map(c => c.category);
  }

  async getReferrals(userId: string): Promise<Referral[]> {
    return db.select().from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [created] = await db.insert(referrals).values(referral).returning();
    return created;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return db.select().from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [created] = await db.insert(walletTransactions).values(transaction).returning();
    return created;
  }

  async getBlogArticles(page: number = 1, limit: number = 20, category?: string): Promise<{ data: BlogArticle[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select().from(blogArticles);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(blogArticles);
    
    if (category && category !== "All") {
      query = query.where(eq(blogArticles.category, category)) as any;
      countQuery = countQuery.where(eq(blogArticles.category, category)) as any;
    }
    
    const data = await query.orderBy(desc(blogArticles.publishedDate)).limit(limit).offset(offset);
    const [{ count }] = await countQuery;
    
    return { data, total: Number(count) };
  }

  async getBlogArticle(id: number): Promise<BlogArticle | undefined> {
    const [article] = await db.select().from(blogArticles).where(eq(blogArticles.id, id));
    return article;
  }

  async createBlogArticle(article: InsertBlogArticle): Promise<BlogArticle> {
    const [created] = await db.insert(blogArticles).values(article).returning();
    return created;
  }

  async updateBlogArticle(id: number, data: Partial<InsertBlogArticle>): Promise<BlogArticle | undefined> {
    const [updated] = await db.update(blogArticles).set(data).where(eq(blogArticles.id, id)).returning();
    return updated;
  }

  async deleteBlogArticle(id: number): Promise<boolean> {
    const result = await db.delete(blogArticles).where(eq(blogArticles.id, id)).returning();
    return result.length > 0;
  }

  async getFeaturedArticles(limit: number = 3): Promise<BlogArticle[]> {
    return db.select().from(blogArticles)
      .where(eq(blogArticles.featured, true))
      .orderBy(desc(blogArticles.publishedDate))
      .limit(limit);
  }

  async seedDatabase(): Promise<void> {
    const adminEmail = "admin@example.com";
    const existingAdmin = await this.getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("AdminTest123!", 10);
      await db.insert(users).values({
        email: adminEmail,
        name: "Admin User",
        username: "admin",
        password: hashedPassword,
        role: "admin",
        country: "Global",
        sector: "Platform",
        currency: "USD",
        displayPreference: "real_name",
        referralCode: "ADMIN001",
        referralCount: 0,
        referralEarningsINR: 0,
        referralEarningsUSD: 0,
        showEarningsPublicly: false,
        walletINRAvailable: 0,
        walletINRPending: 0,
        walletUSDAvailable: 0,
        walletUSDPending: 0,
        leaderboardRank: 0,
        percentile: 100,
        subscriptionTier: "Pro Max Ultra",
        status: "verified",
        subscriptionStatus: "active_preview",
        planType: "enterprise",
      });
      console.log("Admin user seeded: admin@example.com / AdminTest123!");
    }
    
    const existingUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    if (Number(existingUsers[0].count) > 1) {
      return;
    }

    const countries = ["USA", "India", "UK", "Germany", "France", "Japan", "Brazil", "Canada", "Australia", "Singapore", "Vietnam", "Armenia", "Hungary", "Qatar", "Bahrain", "Lebanon"];
    const sectors = ["Fintech", "Healthtech", "Edtech", "SaaS", "E-commerce", "AI", "Clean Energy", "Parking & Mobility", "Tax Planning", "Smart Home & IoT", "Enterprise Software", "Language Learning", "Logistics", "Government Tech", "Shipping & Freight"];
    const roles = ["startup", "investor", "enabler", "professional", "influencer", "accelerator", "ngo", "vc", "government", "mentor"];
    const tiers = ["Beginner", "Professional", "Advanced", "Pro Max Ultra"];
    const activities = [
      { name: "Platform Onboarding", category: "Setup" },
      { name: "Profile Completion", category: "Setup" },
      { name: "Pitch Deck Upload", category: "Content" },
      { name: "Investor Meeting", category: "Networking" },
      { name: "Webinar Attendance", category: "Learning" },
      { name: "Mentor Session", category: "Networking" },
      { name: "Document Review", category: "Admin" },
      { name: "Team Collaboration", category: "Work" },
      { name: "Market Research", category: "Research" },
      { name: "Product Demo", category: "Sales" },
      { name: "Funding Application", category: "Finance" },
      { name: "Compliance Check", category: "Admin" },
      { name: "Partnership Discussion", category: "Networking" },
      { name: "Strategy Planning", category: "Planning" },
      { name: "Customer Interview", category: "Research" },
    ];

    const usersToInsert: InsertUser[] = [];
    for (let i = 1; i <= 350; i++) {
      usersToInsert.push({
        email: `user${i}@i2u.ai`,
        name: `User ${i}`,
        username: `user_${i}`,
        password: "hashed_password_placeholder",
        role: roles[Math.floor(Math.random() * roles.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        currency: i % 2 === 0 ? "USD" : "INR",
        displayPreference: "real_name",
        companyName: i % 3 === 0 ? `Company ${i}` : null,
        startupStage: i % 4 === 0 ? ["Idea", "Pre-seed", "Seed", "Series A", "Series B"][Math.floor(Math.random() * 5)] : null,
        referralCode: `REF${10000 + i}`,
        referralCount: Math.floor(Math.random() * 50),
        referralEarningsINR: Math.floor(Math.random() * 10000),
        referralEarningsUSD: Math.floor(Math.random() * 200),
        showEarningsPublicly: Math.random() > 0.3,
        walletINRAvailable: Math.floor(Math.random() * 5000),
        walletINRPending: Math.floor(Math.random() * 1000),
        walletUSDAvailable: Math.floor(Math.random() * 100),
        walletUSDPending: Math.floor(Math.random() * 50),
        leaderboardRank: i,
        percentile: Math.min(99.9, (i / 350) * 100),
        subscriptionTier: tiers[Math.floor(Math.random() * tiers.length)],
        status: Math.random() > 0.2 ? "verified" : "pending",
      });
    }

    await db.insert(users).values(usersToInsert);

    const insertedUsers = await db.select({ id: users.id }).from(users);
    
    const activitiesToInsert: InsertActivity[] = [];
    for (let i = 0; i < 350; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      activitiesToInsert.push({
        userId: randomUser.id,
        activityName: activity.name,
        category: activity.category,
        timeSpentMinutes: Math.floor(Math.random() * 180) + 15,
        description: `${activity.name} session completed`,
      });
    }

    await db.insert(activityTimeTracking).values(activitiesToInsert);
  }

  async ensureAdminExists(): Promise<void> {
    const adminEmail = "admin@example.com";
    const existingAdmin = await this.getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("AdminTest123!", 10);
      await db.insert(users).values({
        email: adminEmail,
        name: "Admin User",
        username: "admin",
        password: hashedPassword,
        role: "admin",
        country: "Global",
        sector: "Platform",
        currency: "USD",
        displayPreference: "real_name",
        referralCode: "ADMIN001",
        referralCount: 0,
        referralEarningsINR: 0,
        referralEarningsUSD: 0,
        showEarningsPublicly: false,
        walletINRAvailable: 0,
        walletINRPending: 0,
        walletUSDAvailable: 0,
        walletUSDPending: 0,
        leaderboardRank: 0,
        percentile: 100,
        subscriptionTier: "Pro Max Ultra",
        status: "verified",
        subscriptionStatus: "active_preview",
        planType: "enterprise",
      });
      console.log("Admin user created in production");
    }
  }

  async cleanupMockUsers(): Promise<number> {
    // First get the IDs of mock users to delete related records
    const mockUsers = await db.select({ id: users.id })
      .from(users)
      .where(sql`${users.email} LIKE 'user%@i2u.ai'`);
    
    if (mockUsers.length === 0) {
      return 0;
    }
    
    const mockUserIds = mockUsers.map(u => u.id);
    
    // Delete related activity time tracking records first
    await db.delete(activityTimeTracking)
      .where(sql`${activityTimeTracking.userId} = ANY(ARRAY[${sql.raw(mockUserIds.map(id => `'${id}'`).join(','))}]::text[])`);
    
    // Delete related referrals where mock users are referrer or referred
    await db.delete(referrals)
      .where(sql`${referrals.referrerId} = ANY(ARRAY[${sql.raw(mockUserIds.map(id => `'${id}'`).join(','))}]::text[]) OR ${referrals.referredId} = ANY(ARRAY[${sql.raw(mockUserIds.map(id => `'${id}'`).join(','))}]::text[])`);
    
    // Delete related wallet transactions
    await db.delete(walletTransactions)
      .where(sql`${walletTransactions.userId} = ANY(ARRAY[${sql.raw(mockUserIds.map(id => `'${id}'`).join(','))}]::text[])`);
    
    // Now delete the mock users
    const result = await db.delete(users)
      .where(sql`${users.email} LIKE 'user%@i2u.ai'`)
      .returning();
    return result.length;
  }

  async fixProfessionalStakeholderTypes(): Promise<number> {
    const result = await db.update(users)
      .set({ stakeholderType: 'professional' })
      .where(sql`${users.role} IN ('professional', 'job_seeker') AND ${users.stakeholderType} = 'ecosystem'`)
      .returning();
    return result.length;
  }

  async getPricingBrackets(stakeholderType?: string): Promise<PricingBracket[]> {
    if (stakeholderType) {
      return db.select().from(pricingBrackets)
        .where(and(eq(pricingBrackets.stakeholderType, stakeholderType), eq(pricingBrackets.isActive, true)))
        .orderBy(asc(pricingBrackets.minSignups));
    }
    return db.select().from(pricingBrackets)
      .where(eq(pricingBrackets.isActive, true))
      .orderBy(asc(pricingBrackets.stakeholderType), asc(pricingBrackets.minSignups));
  }

  async getSignupCount(stakeholderType: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.stakeholderType, stakeholderType));
    return Number(result[0].count);
  }

  async getEcosystemSignupCount(): Promise<number> {
    const ecosystemTypes = ['startup', 'investor', 'accelerator', 'government', 'influencer', 'vc', 'ngo', 'angel', 'ecosystem', 'builder', 'enabler', 'mentor', 'service_provider', 'supplier'];
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.stakeholderType} = ANY(ARRAY[${sql.raw(ecosystemTypes.map(t => `'${t}'`).join(','))}]::text[])`);
    return Number(result[0].count);
  }

  async getProfessionalSignupCount(): Promise<number> {
    const PROFESSIONAL_BASELINE = 67;
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.stakeholderType, 'professional'));
    return PROFESSIONAL_BASELINE + Number(result[0].count);
  }

  async getCurrentPrice(stakeholderType: string, currency: string): Promise<{ amount: number; bracket: PricingBracket | null }> {
    const signupCount = await this.getSignupCount(stakeholderType);
    
    const brackets = await db.select().from(pricingBrackets)
      .where(and(
        eq(pricingBrackets.stakeholderType, stakeholderType),
        eq(pricingBrackets.currency, currency),
        eq(pricingBrackets.isActive, true),
        lte(pricingBrackets.minSignups, signupCount + 1)
      ))
      .orderBy(desc(pricingBrackets.minSignups))
      .limit(1);
    
    if (brackets.length > 0) {
      return { amount: brackets[0].amount, bracket: brackets[0] };
    }
    
    const defaultBrackets = await db.select().from(pricingBrackets)
      .where(and(
        eq(pricingBrackets.stakeholderType, stakeholderType),
        eq(pricingBrackets.currency, currency),
        eq(pricingBrackets.isActive, true)
      ))
      .orderBy(asc(pricingBrackets.minSignups))
      .limit(1);
    
    if (defaultBrackets.length > 0) {
      return { amount: defaultBrackets[0].amount, bracket: defaultBrackets[0] };
    }
    
    return { amount: stakeholderType === "professional" ? (currency === "INR" ? 99 : 1.49) : (currency === "INR" ? 999 : 14.99), bracket: null };
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return db.select().from(subscriptionTiersTable)
      .where(eq(subscriptionTiersTable.isActive, true))
      .orderBy(asc(subscriptionTiersTable.sortOrder));
  }

  async getSubscriptionTier(tierCode: string): Promise<SubscriptionTier | undefined> {
    const [tier] = await db.select().from(subscriptionTiersTable).where(eq(subscriptionTiersTable.tierCode, tierCode));
    return tier;
  }

  async createPaymentIntent(intent: InsertPaymentIntent): Promise<PaymentIntent> {
    const [created] = await db.insert(paymentIntents).values(intent).returning();
    return created;
  }

  async getPaymentIntent(id: number): Promise<PaymentIntent | undefined> {
    const [intent] = await db.select().from(paymentIntents).where(eq(paymentIntents.id, id));
    return intent;
  }

  async getPaymentIntentsByUser(userId: string): Promise<PaymentIntent[]> {
    return db.select().from(paymentIntents)
      .where(eq(paymentIntents.userId, userId))
      .orderBy(desc(paymentIntents.createdAt));
  }

  async getPendingPaymentIntents(): Promise<(PaymentIntent & { userName?: string; userEmail?: string; userPhone?: string })[]> {
    const results = await db.select({
      id: paymentIntents.id,
      userId: paymentIntents.userId,
      intentType: paymentIntents.intentType,
      paymentMethod: paymentIntents.paymentMethod,
      status: paymentIntents.status,
      amount: paymentIntents.amount,
      currency: paymentIntents.currency,
      transactionRef: paymentIntents.transactionRef,
      providerOrderId: paymentIntents.providerOrderId,
      upiId: paymentIntents.upiId,
      bankDetails: paymentIntents.bankDetails,
      proofImageUrl: paymentIntents.proofImageUrl,
      notes: paymentIntents.notes,
      verifiedBy: paymentIntents.verifiedBy,
      verifiedAt: paymentIntents.verifiedAt,
      createdAt: paymentIntents.createdAt,
      updatedAt: paymentIntents.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userPhone: users.phone,
    })
    .from(paymentIntents)
    .leftJoin(users, eq(paymentIntents.userId, users.id))
    .where(or(eq(paymentIntents.status, "pending"), eq(paymentIntents.status, "submitted")))
    .orderBy(desc(paymentIntents.createdAt));
    
    return results;
  }

  async updatePaymentIntent(id: number, data: Partial<InsertPaymentIntent>): Promise<PaymentIntent | undefined> {
    const [updated] = await db.update(paymentIntents).set(data).where(eq(paymentIntents.id, id)).returning();
    return updated;
  }

  async createPaymentFollowup(followup: InsertPaymentFollowup): Promise<PaymentFollowup> {
    const [created] = await db.insert(paymentFollowups).values(followup).returning();
    return created;
  }

  async getPaymentFollowups(paymentIntentId: number): Promise<PaymentFollowup[]> {
    return db.select().from(paymentFollowups)
      .where(eq(paymentFollowups.paymentIntentId, paymentIntentId))
      .orderBy(desc(paymentFollowups.sentAt));
  }

  async seedPricingData(): Promise<void> {
    const existingBrackets = await db.select({ count: sql<number>`count(*)` }).from(pricingBrackets);
    if (Number(existingBrackets[0].count) > 0) return;

    const brackets: InsertPricingBracket[] = [
      // Ecosystem INR - ₹1,000 increments
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 1, maxSignups: 100, amount: 999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 101, maxSignups: 200, amount: 1999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 201, maxSignups: 300, amount: 2999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 301, maxSignups: 400, amount: 4999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 401, maxSignups: 500, amount: 5999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 501, maxSignups: 600, amount: 6999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 601, maxSignups: 700, amount: 7999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 701, maxSignups: 800, amount: 8999, isActive: true },
      { stakeholderType: "ecosystem", currency: "INR", minSignups: 801, maxSignups: null, amount: 9999, isActive: true },
      // Ecosystem USD - $15 increments
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 1, maxSignups: 100, amount: 14.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 101, maxSignups: 200, amount: 29.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 201, maxSignups: 300, amount: 44.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 301, maxSignups: 400, amount: 74.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 401, maxSignups: 500, amount: 89.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 501, maxSignups: 600, amount: 104.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 601, maxSignups: 700, amount: 119.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 701, maxSignups: 800, amount: 134.99, isActive: true },
      { stakeholderType: "ecosystem", currency: "USD", minSignups: 801, maxSignups: null, amount: 149.99, isActive: true },
      // Professional INR - ₹100 increments
      { stakeholderType: "professional", currency: "INR", minSignups: 1, maxSignups: 100, amount: 99, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 101, maxSignups: 200, amount: 199, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 201, maxSignups: 300, amount: 299, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 301, maxSignups: 400, amount: 499, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 401, maxSignups: 500, amount: 599, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 501, maxSignups: 600, amount: 699, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 601, maxSignups: 700, amount: 799, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 701, maxSignups: 800, amount: 899, isActive: true },
      { stakeholderType: "professional", currency: "INR", minSignups: 801, maxSignups: null, amount: 999, isActive: true },
      // Professional USD - ~$1.50 increments
      { stakeholderType: "professional", currency: "USD", minSignups: 1, maxSignups: 100, amount: 1.49, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 101, maxSignups: 200, amount: 2.99, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 201, maxSignups: 300, amount: 4.49, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 301, maxSignups: 400, amount: 7.49, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 401, maxSignups: 500, amount: 8.99, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 501, maxSignups: 600, amount: 10.49, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 601, maxSignups: 700, amount: 11.99, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 701, maxSignups: 800, amount: 13.49, isActive: true },
      { stakeholderType: "professional", currency: "USD", minSignups: 801, maxSignups: null, amount: 14.99, isActive: true },
    ];
    await db.insert(pricingBrackets).values(brackets);

    const existingTiers = await db.select({ count: sql<number>`count(*)` }).from(subscriptionTiersTable);
    if (Number(existingTiers[0].count) > 0) return;

    const tiers: InsertSubscriptionTier[] = [
      { tierCode: "free", name: "Free Forever", amountINR: 0, amountUSD: 0, sortOrder: 0, isActive: true, features: "Basic AI resources, Template website, 1 Email ID, 50 MB storage" },
      { tierCode: "beginner", name: "Beginner", amountINR: 16000, amountUSD: 240, sortOrder: 1, isActive: true, features: "Basic Virtual Space, 1 Participation Credit, Basic AI Assistant, 100 MB storage" },
      { tierCode: "basic", name: "Basic", amountINR: 24000, amountUSD: 360, sortOrder: 2, isActive: true, features: "Customizable Virtual Office, 5 Credits, Advanced AI, 1 GB storage, Email Support" },
      { tierCode: "advanced", name: "Advanced", amountINR: 36000, amountUSD: 540, sortOrder: 3, isActive: true, features: "Advanced Virtual Office, 10 Credits, 2 AI Assistants, E-commerce, 5 GB storage" },
      { tierCode: "professional", name: "Professional", amountINR: 60000, amountUSD: 900, sortOrder: 4, isActive: true, features: "Premium Virtual Office with VR, 20 Credits, 3 AI Assistants, 10 GB storage" },
      { tierCode: "pro_max_ultra", name: "Pro Max Ultra", amountINR: 100000, amountUSD: 1500, sortOrder: 5, isActive: true, features: "Ultra-Premium with AI Decor, 50 Credits, 5 AI Assistants, 50 GB, 24/7 Support" },
    ];
    await db.insert(subscriptionTiersTable).values(tiers);
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    const [result] = await db.insert(suggestions).values(suggestion).returning();
    return result;
  }

  async getSuggestion(id: number): Promise<Suggestion | undefined> {
    const [suggestion] = await db.select().from(suggestions).where(eq(suggestions.id, id));
    return suggestion;
  }

  async getSuggestions(page: number = 1, limit: number = 20, status?: string, category?: string): Promise<{ data: (Suggestion & { userName?: string })[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let conditions = [];
    if (status) conditions.push(eq(suggestions.status, status));
    if (category) conditions.push(eq(suggestions.category, category));
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(suggestions)
      .where(whereClause);
    const total = Number(countResult[0].count);
    
    const data = await db.select({
      id: suggestions.id,
      userId: suggestions.userId,
      guestName: suggestions.guestName,
      guestEmail: suggestions.guestEmail,
      guestPhone: suggestions.guestPhone,
      guestCountryCode: suggestions.guestCountryCode,
      title: suggestions.title,
      content: suggestions.content,
      category: suggestions.category,
      status: suggestions.status,
      voteCount: suggestions.voteCount,
      rewardAmountInr: suggestions.rewardAmountInr,
      rewardAmountUsd: suggestions.rewardAmountUsd,
      recognitionPeriod: suggestions.recognitionPeriod,
      recognitionDate: suggestions.recognitionDate,
      adminNotes: suggestions.adminNotes,
      createdAt: suggestions.createdAt,
      updatedAt: suggestions.updatedAt,
      userName: sql<string>`COALESCE(${users.name}, ${suggestions.guestName}, 'Anonymous')`.as("user_name"),
    })
      .from(suggestions)
      .leftJoin(users, eq(suggestions.userId, users.id))
      .where(whereClause)
      .orderBy(desc(suggestions.voteCount), desc(suggestions.createdAt))
      .limit(limit)
      .offset(offset);
    
    return { data, total };
  }

  async getUserSuggestions(userId: string): Promise<Suggestion[]> {
    return db.select().from(suggestions).where(eq(suggestions.userId, userId)).orderBy(desc(suggestions.createdAt));
  }

  async updateSuggestion(id: number, data: Partial<InsertSuggestion>): Promise<Suggestion | undefined> {
    const [suggestion] = await db.update(suggestions).set({ ...data, updatedAt: new Date() }).where(eq(suggestions.id, id)).returning();
    return suggestion;
  }

  async deleteSuggestion(id: number): Promise<boolean> {
    await db.delete(suggestionVotes).where(eq(suggestionVotes.suggestionId, id));
    await db.delete(suggestionReactions).where(eq(suggestionReactions.suggestionId, id));
    await db.delete(suggestionComments).where(eq(suggestionComments.suggestionId, id));
    await db.delete(suggestions).where(eq(suggestions.id, id));
    return true;
  }

  async voteSuggestion(suggestionId: number, userId: string): Promise<boolean> {
    const existingVote = await db.select().from(suggestionVotes)
      .where(and(eq(suggestionVotes.suggestionId, suggestionId), eq(suggestionVotes.userId, userId)));
    
    if (existingVote.length > 0) {
      return false;
    }
    
    await db.insert(suggestionVotes).values({ suggestionId, userId, voteType: "upvote" });
    
    await db.update(suggestions)
      .set({ voteCount: sql`GREATEST(0, ${suggestions.voteCount} + 1)` })
      .where(eq(suggestions.id, suggestionId));
    
    return true;
  }

  async getBestSuggestions(period: string, limit: number = 10): Promise<(Suggestion & { userName?: string })[]> {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case "hour":
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "half_year":
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "2_years":
        startDate = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "3_years":
        startDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "4_years":
        startDate = new Date(now.getTime() - 4 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "5_years":
        startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "decade":
        startDate = new Date(now.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }
    
    return db.select({
      id: suggestions.id,
      userId: suggestions.userId,
      guestName: suggestions.guestName,
      guestEmail: suggestions.guestEmail,
      guestPhone: suggestions.guestPhone,
      guestCountryCode: suggestions.guestCountryCode,
      title: suggestions.title,
      content: suggestions.content,
      category: suggestions.category,
      status: suggestions.status,
      voteCount: suggestions.voteCount,
      rewardAmountInr: suggestions.rewardAmountInr,
      rewardAmountUsd: suggestions.rewardAmountUsd,
      recognitionPeriod: suggestions.recognitionPeriod,
      recognitionDate: suggestions.recognitionDate,
      adminNotes: suggestions.adminNotes,
      createdAt: suggestions.createdAt,
      updatedAt: suggestions.updatedAt,
      userName: sql<string>`COALESCE(${users.name}, ${suggestions.guestName}, 'Anonymous')`.as("user_name"),
    })
      .from(suggestions)
      .leftJoin(users, eq(suggestions.userId, users.id))
      .where(gte(suggestions.createdAt, startDate))
      .orderBy(desc(suggestions.voteCount))
      .limit(limit);
  }

  async awardSuggestion(id: number, rewardInr: number, rewardUsd: number, period: string): Promise<Suggestion | undefined> {
    const suggestion = await this.getSuggestion(id);
    if (!suggestion || !suggestion.userId) return undefined;
    
    const [updated] = await db.update(suggestions).set({
      rewardAmountInr: rewardInr,
      rewardAmountUsd: rewardUsd,
      recognitionPeriod: period,
      recognitionDate: new Date(),
      updatedAt: new Date(),
    }).where(eq(suggestions.id, id)).returning();
    
    const user = await this.getUser(suggestion.userId);
    if (user) {
      await this.updateUser(user.id, {
        walletINRAvailable: (user.walletINRAvailable || 0) + rewardInr,
        walletUSDAvailable: (user.walletUSDAvailable || 0) + rewardUsd,
      });
      
      if (rewardInr > 0) {
        await this.createTransaction({
          userId: user.id,
          type: "suggestion_reward",
          amount: rewardInr,
          currency: "INR",
          status: "completed",
        });
      }
      if (rewardUsd > 0) {
        await this.createTransaction({
          userId: user.id,
          type: "suggestion_reward",
          amount: rewardUsd,
          currency: "USD",
          status: "completed",
        });
      }
    }
    
    return updated;
  }

  async addReaction(suggestionId: number, reactionType: string, userId?: string, guestSessionId?: string): Promise<SuggestionReaction | null> {
    if (!userId && !guestSessionId) return null;
    
    const existingReaction = await this.getUserReaction(suggestionId, userId, guestSessionId);
    
    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        return existingReaction;
      }
      await this.removeReaction(suggestionId, userId, guestSessionId);
    }
    
    const [reaction] = await db.insert(suggestionReactions).values({
      suggestionId,
      reactionType,
      userId: userId || null,
      guestSessionId: guestSessionId || null,
    }).returning();
    
    return reaction;
  }

  async removeReaction(suggestionId: number, userId?: string, guestSessionId?: string): Promise<boolean> {
    if (!userId && !guestSessionId) return false;
    
    const conditions = [eq(suggestionReactions.suggestionId, suggestionId)];
    
    if (userId) {
      conditions.push(eq(suggestionReactions.userId, userId));
    } else if (guestSessionId) {
      conditions.push(eq(suggestionReactions.guestSessionId, guestSessionId));
    }
    
    await db.delete(suggestionReactions).where(and(...conditions));
    return true;
  }

  async getReactionCounts(suggestionId: number): Promise<{ thumbs_up: number; thumbs_down: number }> {
    const reactions = await db.select({
      reactionType: suggestionReactions.reactionType,
      count: sql<number>`count(*)`,
    })
      .from(suggestionReactions)
      .where(eq(suggestionReactions.suggestionId, suggestionId))
      .groupBy(suggestionReactions.reactionType);
    
    const counts = { thumbs_up: 0, thumbs_down: 0 };
    for (const r of reactions) {
      if (r.reactionType === "thumbs_up") counts.thumbs_up = Number(r.count);
      if (r.reactionType === "thumbs_down") counts.thumbs_down = Number(r.count);
    }
    return counts;
  }

  async getUserReaction(suggestionId: number, userId?: string, guestSessionId?: string): Promise<SuggestionReaction | null> {
    if (!userId && !guestSessionId) return null;
    
    const conditions = [eq(suggestionReactions.suggestionId, suggestionId)];
    
    if (userId) {
      conditions.push(eq(suggestionReactions.userId, userId));
    } else if (guestSessionId) {
      conditions.push(eq(suggestionReactions.guestSessionId, guestSessionId));
    }
    
    const [reaction] = await db.select().from(suggestionReactions).where(and(...conditions));
    return reaction || null;
  }

  async addComment(data: InsertSuggestionComment): Promise<SuggestionComment> {
    const [comment] = await db.insert(suggestionComments).values(data).returning();
    return comment;
  }

  async getComments(suggestionId: number): Promise<(SuggestionComment & { userName?: string })[]> {
    return db.select({
      id: suggestionComments.id,
      suggestionId: suggestionComments.suggestionId,
      userId: suggestionComments.userId,
      guestName: suggestionComments.guestName,
      guestEmail: suggestionComments.guestEmail,
      content: suggestionComments.content,
      createdAt: suggestionComments.createdAt,
      updatedAt: suggestionComments.updatedAt,
      userName: sql<string>`COALESCE(${users.name}, ${suggestionComments.guestName}, 'Anonymous')`.as("user_name"),
    })
      .from(suggestionComments)
      .leftJoin(users, eq(suggestionComments.userId, users.id))
      .where(eq(suggestionComments.suggestionId, suggestionId))
      .orderBy(asc(suggestionComments.createdAt));
  }

  async deleteComment(id: number, userId?: string): Promise<boolean> {
    const conditions = [eq(suggestionComments.id, id)];
    if (userId) {
      conditions.push(eq(suggestionComments.userId, userId));
    }
    await db.delete(suggestionComments).where(and(...conditions));
    return true;
  }
}

export const storage = new DatabaseStorage();
