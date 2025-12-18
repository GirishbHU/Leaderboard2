import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertActivitySchema, insertBlogArticleSchema, insertSuggestionSchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault, verifyPayPalPaymentById } from "./paypal";
import { 
  createCashfreeOrder, 
  verifyCashfreePayment, 
  getCashfreeOrderStatus, 
  handleCashfreeWebhook, 
  getCashfreeConfig,
  verifyCashfreePaymentById
} from "./cashfree";
import { processPayment, getPaymentMode, isMockMode, getPaymentGatewayStatus } from "./paymentService";
import { seedBlogArticles } from "./seedBlog";
import bcrypt from "bcryptjs";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
}

function requireActiveSubscription(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }
  const status = req.session.subscriptionStatus;
  const activeStatuses = ["active", "active_preview", "active_sandbox", "pending_payment"];
  if (!status || !activeStatuses.includes(status)) {
    return res.status(403).json({ error: "Forbidden - Active subscription required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Only seed mock users in development - production should have real users only
  if (process.env.NODE_ENV !== 'production') {
    await storage.seedDatabase();
  } else {
    // In production, only ensure admin exists (no mock users)
    await storage.ensureAdminExists();
  }
  await storage.seedPricingData();
  await seedBlogArticles();

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const passwordMatch = user.password.startsWith("$2") 
        ? await bcrypt.compare(password, user.password)
        : password === user.password;
        
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;
      req.session.isAdmin = user.role === "admin";
      req.session.subscriptionStatus = user.subscriptionStatus;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        isAdmin: user.role === "admin",
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json({ authenticated: false });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json({ authenticated: false });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      authenticated: true,
      user: userWithoutPassword,
      isAdmin: user.role === "admin",
      subscriptionStatus: user.subscriptionStatus,
    });
  });

  app.post("/api/preview/checkout", requireAuth, async (req, res) => {
    try {
      const { planType, amount, currency } = req.body;
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const paymentResult = await processPayment({
        userId,
        amount: amount || 0,
        currency: currency || user.currency as "INR" | "USD",
        planType: planType || "preview",
        email: user.email,
      });
      
      if (!paymentResult.success) {
        return res.status(400).json({ error: paymentResult.error || "Payment failed" });
      }
      
      await storage.updateUser(userId, {
        subscriptionStatus: "active_preview",
        planType: planType || "preview",
      });
      
      req.session.subscriptionStatus = "active_preview";
      
      res.json({
        success: true,
        orderId: paymentResult.orderId,
        transactionId: paymentResult.transactionId,
        message: paymentResult.message,
        paymentMode: getPaymentMode(),
        isMock: isMockMode(),
      });
    } catch (error) {
      console.error("Preview checkout error:", error);
      res.status(500).json({ error: "Checkout failed" });
    }
  });

  app.get("/api/preview/status", (req, res) => {
    const mode = process.env.PAYMENTS_MODE || "mock";
    res.json({
      paymentMode: mode,
      isMockMode: mode === "mock",
    });
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, phone, role, country, sector, currency, displayPreference, paymentId, paymentStatus, paymentProvider } = req.body;
      
      // Only email OR phone is required - everything else is optional
      const hasEmail = email && email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const hasPhone = phone && phone.trim().length >= 10;
      
      if (!hasEmail && !hasPhone) {
        return res.status(400).json({ error: "Please provide either a valid email address or phone number" });
      }

      // Generate UTC timestamp with microsecond precision
      const registrationTimestampUTC = new Date().toISOString();
      const registrationMicroseconds = process.hrtime.bigint().toString();
      
      console.log(`Registration initiated at UTC: ${registrationTimestampUTC} (micro: ${registrationMicroseconds})`);

      if (!paymentId || !paymentProvider) {
        return res.status(400).json({ error: "Payment ID and provider are required" });
      }

      // Handle free registrations (government/NGO) and pending registrations
      const isFreeOrPending = paymentProvider === "none" || paymentId.startsWith("free_") || paymentId.startsWith("pending_");
      
      if (isFreeOrPending) {
        // Skip payment verification for free/pending registrations
        console.log(`Free/pending registration - skipping payment verification (provider: ${paymentProvider}, paymentId: ${paymentId})`);
        
        // Check for existing user
        if (hasEmail) {
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
          }
        }
        if (hasPhone) {
          const existingPhoneUser = await storage.getUserByPhone(phone);
          if (existingPhoneUser) {
            return res.status(400).json({ error: "Phone number already registered" });
          }
        }
        
        const tempPassword = `i2u_${Date.now().toString(36)}`;
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const referralCode = `REF-${Date.now().toString(36).toUpperCase()}`;
        
        let username: string;
        if (hasEmail) {
          username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
        } else {
          const phoneDigits = phone.replace(/[^0-9]/g, "").slice(-6);
          username = `user${phoneDigits}${Math.floor(Math.random() * 100)}`;
        }
        
        const userEmail = hasEmail ? email : `${phone.replace(/[^0-9]/g, "")}@phone.i2u.ai`;
        const userName = name?.trim() || (hasEmail ? email.split("@")[0] : `User-${phone.slice(-4)}`);
        
        // Determine status based on payment type
        const isFreeRole = paymentId.startsWith("free_");
        const subscriptionStatus = isFreeRole ? "active" : "pending_payment";
        const planType = isFreeRole ? "free" : "pending";
        const subscriptionTier = isFreeRole ? "Free" : "Free";
        const stakeholderType = ["professional", "job_seeker"].includes(role) ? "professional" : "ecosystem";
        
        const newUser = await storage.createUser({
          name: userName,
          email: userEmail,
          phone: hasPhone ? phone : null,
          password: hashedPassword,
          username,
          role: role || "startup",
          stakeholderType,
          country: country || "Not specified",
          sector: sector || "General",
          currency: currency || "INR",
          displayPreference: displayPreference || "real_name",
          referralCode,
          subscriptionStatus,
          planType,
          subscriptionTier,
          leaderboardRank: 0,
          percentile: 0,
          walletINRAvailable: 0,
          walletINRPending: 0,
          walletUSDAvailable: 0,
          walletUSDPending: 0,
          referredBy: null,
          activityPrivacy: "public_leaderboard",
          paymentId,
          paymentProvider,
          paymentAmount: 0,
          paymentCurrency: currency || "INR",
        });
        
        req.session.userId = newUser.id;
        req.session.userEmail = newUser.email;
        req.session.userRole = newUser.role;
        req.session.isAdmin = false;
        req.session.subscriptionStatus = subscriptionStatus;
        
        const userIdentifier = hasEmail ? email : phone;
        console.log(`New user registered: ${userIdentifier} at ${registrationTimestampUTC} (Status: ${subscriptionStatus})`);
        
        const { password: _, ...userWithoutPassword } = newUser;
        
        return res.status(201).json({
          success: true,
          message: isFreeRole ? "Registration successful! Welcome to i2u.ai" : "Account created! You can complete payment anytime.",
          userId: newUser.id,
          referralCode,
          user: userWithoutPassword,
          paymentPending: !isFreeRole,
        });
      }

      const REQUIRED_AMOUNTS = {
        USD: 99,
        INR: 8199
      };
      
      const ALLOWED_CURRENCIES = {
        paypal: "USD",
        cashfree: "INR"
      };

      let paymentVerified = false;
      let verificationDetails: any = null;
      let verifiedAmount: number = 0;
      let verifiedCurrency: string = "";

      if (paymentProvider === "paypal") {
        const verification = await verifyPayPalPaymentById(paymentId);
        paymentVerified = verification.success;
        verificationDetails = verification;
        verifiedAmount = parseFloat(verification.amount || "0");
        verifiedCurrency = verification.currency || "";
        console.log(`PayPal payment verification for ${paymentId}:`, verification);
        
        if (paymentVerified) {
          if (verifiedCurrency !== ALLOWED_CURRENCIES.paypal) {
            console.log(`PayPal currency mismatch: ${verifiedCurrency} !== ${ALLOWED_CURRENCIES.paypal}`);
            return res.status(402).json({ 
              error: "Invalid payment currency. USD payments required.",
              details: "CURRENCY_MISMATCH"
            });
          }
          const amountDiff = Math.abs(verifiedAmount - REQUIRED_AMOUNTS.USD);
          if (amountDiff > 0.50) {
            console.log(`PayPal payment amount mismatch: ${verifiedAmount} !== ${REQUIRED_AMOUNTS.USD} (diff: ${amountDiff})`);
            return res.status(402).json({ 
              error: "Payment amount does not match. Please contact support.",
              details: "AMOUNT_MISMATCH"
            });
          }
        }
      } else if (paymentProvider === "cashfree") {
        const verification = await verifyCashfreePaymentById(paymentId);
        paymentVerified = verification.success;
        verificationDetails = verification;
        verifiedAmount = verification.amount || 0;
        verifiedCurrency = verification.currency || "INR";
        console.log(`Cashfree payment verification for ${paymentId}:`, verification);
        
        if (paymentVerified) {
          if (verifiedCurrency !== ALLOWED_CURRENCIES.cashfree) {
            console.log(`Cashfree currency mismatch: ${verifiedCurrency} !== ${ALLOWED_CURRENCIES.cashfree}`);
            return res.status(402).json({ 
              error: "Invalid payment currency. INR payments required.",
              details: "CURRENCY_MISMATCH"
            });
          }
          const amountDiff = Math.abs(verifiedAmount - REQUIRED_AMOUNTS.INR);
          if (amountDiff > 1) {
            console.log(`Cashfree payment amount mismatch: ${verifiedAmount} !== ${REQUIRED_AMOUNTS.INR} (diff: ${amountDiff})`);
            return res.status(402).json({ 
              error: "Payment amount does not match. Please contact support.",
              details: "AMOUNT_MISMATCH"
            });
          }
        }
      } else {
        return res.status(400).json({ error: "Invalid payment provider" });
      }

      // Only block replay attacks for successfully verified payments
      if (paymentVerified) {
        const existingPaymentUser = await storage.getUserByPaymentId(paymentId);
        if (existingPaymentUser) {
          console.log(`Replay attack blocked: Payment ID ${paymentId} already used by user ${existingPaymentUser.email}`);
          return res.status(400).json({ error: "This payment has already been used for registration" });
        }
        console.log(`Payment verified: ${paymentProvider} order ${paymentId} for amount ${verifiedAmount}`);
      } else {
        console.log(`Payment verification failed for ${paymentId}:`, verificationDetails);
        console.log(`Creating user with pending_payment status - user can complete payment later`);
      }
      
      // Check for existing user by email or phone
      if (hasEmail) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "Email already registered" });
        }
      }
      if (hasPhone) {
        const existingPhoneUser = await storage.getUserByPhone(phone);
        if (existingPhoneUser) {
          return res.status(400).json({ error: "Phone number already registered" });
        }
      }
      
      const tempPassword = `i2u_${Date.now().toString(36)}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      const referralCode = `REF-${Date.now().toString(36).toUpperCase()}`;
      
      // Generate username from email or phone
      let username: string;
      if (hasEmail) {
        username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
      } else {
        const phoneDigits = phone.replace(/[^0-9]/g, "").slice(-6);
        username = `user${phoneDigits}${Math.floor(Math.random() * 100)}`;
      }
      
      // Use email if provided, otherwise generate placeholder from phone
      const userEmail = hasEmail ? email : `${phone.replace(/[^0-9]/g, "")}@phone.i2u.ai`;
      const userName = name?.trim() || (hasEmail ? email.split("@")[0] : `User-${phone.slice(-4)}`);
      
      // Set status based on payment verification
      const subscriptionStatus = paymentVerified ? "active" : "pending_payment";
      const planType = paymentVerified ? "paid" : "pending";
      const subscriptionTier = paymentVerified ? "premium" : "Free";
      const stakeholderType = ["professional", "job_seeker"].includes(role) ? "professional" : "ecosystem";
      
      const newUser = await storage.createUser({
        name: userName,
        email: userEmail,
        phone: hasPhone ? phone : null,
        password: hashedPassword,
        username,
        role: role || "startup",
        stakeholderType,
        country: country || "Not specified",
        sector: sector || "General",
        currency: currency || "INR",
        displayPreference: displayPreference || "real_name",
        referralCode,
        subscriptionStatus,
        planType,
        subscriptionTier,
        leaderboardRank: 0,
        percentile: 0,
        walletINRAvailable: 0,
        walletINRPending: 0,
        walletUSDAvailable: 0,
        walletUSDPending: 0,
        referredBy: null,
        activityPrivacy: "public_leaderboard",
        paymentId,
        paymentProvider,
        paymentAmount: paymentVerified ? verifiedAmount : 0,
        paymentCurrency: paymentVerified ? verifiedCurrency : (currency || "INR"),
      });
      
      req.session.userId = newUser.id;
      req.session.userEmail = newUser.email;
      req.session.userRole = newUser.role;
      req.session.isAdmin = false;
      req.session.subscriptionStatus = subscriptionStatus;
      
      const userIdentifier = hasEmail ? email : phone;
      console.log(`New user registered: ${userIdentifier} via ${paymentProvider} at ${registrationTimestampUTC} (Payment ID: ${paymentId}, Status: ${subscriptionStatus})`);
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Return different message based on payment status
      const message = paymentVerified 
        ? "Registration successful! Welcome to i2u.ai" 
        : "Account created! Please complete your payment to unlock all features.";
      
      res.status(201).json({
        success: true,
        message,
        userId: newUser.id,
        referralCode,
        user: userWithoutPassword,
        paymentPending: !paymentVerified,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Update payment status for existing user (after registration)
  app.post("/api/user/update-payment", async (req, res) => {
    try {
      const { userId, paymentId, paymentProvider } = req.body;
      
      if (!userId || !paymentId || !paymentProvider) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Verify payment
      let paymentVerified = false;
      let verifiedAmount = 0;
      let verifiedCurrency = "";
      
      if (paymentProvider === "paypal") {
        const verification = await verifyPayPalPaymentById(paymentId);
        paymentVerified = verification.success;
        verifiedAmount = parseFloat(verification.amount || "0");
        verifiedCurrency = verification.currency || "";
        console.log(`PayPal payment verification for ${paymentId}:`, verification);
      } else if (paymentProvider === "cashfree") {
        const verification = await verifyCashfreePaymentById(paymentId);
        paymentVerified = verification.success;
        verifiedAmount = verification.amount || 0;
        verifiedCurrency = verification.currency || "INR";
        console.log(`Cashfree payment verification for ${paymentId}:`, verification);
      }
      
      if (paymentVerified) {
        // Update user status to active
        await storage.updateUser(userId, {
          subscriptionStatus: "active",
          planType: "paid",
          subscriptionTier: "premium",
          paymentId,
          paymentProvider,
          paymentAmount: verifiedAmount,
          paymentCurrency: verifiedCurrency,
        });
        
        // Update session
        req.session.subscriptionStatus = "active";
        
        console.log(`Payment verified and user ${userId} upgraded to active status`);
        
        res.json({
          success: true,
          message: "Payment verified and account activated!",
        });
      } else {
        console.log(`Payment verification failed for ${paymentId}`);
        res.status(402).json({ 
          error: "Payment verification failed. Your account is still active with pending payment status.",
        });
      }
    } catch (error) {
      console.error("Payment update error:", error);
      res.status(500).json({ error: "Failed to update payment status" });
    }
  });

  app.put("/api/user/privacy", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { displayName, showOnLeaderboard, anonymousMode } = req.body;
      
      const updateData: Record<string, unknown> = {};
      
      if (displayName !== undefined) {
        updateData.displayName = displayName || null;
      }
      if (showOnLeaderboard !== undefined) {
        updateData.showOnLeaderboard = Boolean(showOnLeaderboard);
      }
      if (anonymousMode !== undefined) {
        updateData.anonymousMode = Boolean(anonymousMode);
      }
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true, message: "Privacy settings updated" });
    } catch (error) {
      console.error("Privacy update error:", error);
      res.status(500).json({ error: "Failed to update privacy settings" });
    }
  });

  app.post("/api/register/preview", async (req, res) => {
    try {
      const { name, email, role, country, sector, currency, displayPreference } = req.body;
      
      if (!name || !email || !role || !country || !sector) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const hashedPassword = await bcrypt.hash("preview123", 10);
      
      const referralCode = `REF-${Date.now().toString(36).toUpperCase()}`;
      const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
      const stakeholderType = ["professional", "job_seeker"].includes(role) ? "professional" : "ecosystem";
      
      const newUser = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        username,
        role: role || "startup",
        stakeholderType,
        country,
        sector,
        currency: currency || "USD",
        displayPreference: displayPreference || "real_name",
        referralCode,
        subscriptionStatus: "active_preview",
        planType: "preview",
        subscriptionTier: "basic",
        leaderboardRank: 0,
        percentile: 0,
        walletINRAvailable: 0,
        walletINRPending: 0,
        walletUSDAvailable: 0,
        walletUSDPending: 0,
        referredBy: null,
        activityPrivacy: "public_leaderboard",
      });
      
      req.session.userId = newUser.id;
      req.session.userEmail = newUser.email;
      req.session.userRole = newUser.role;
      req.session.isAdmin = false;
      req.session.subscriptionStatus = "active_preview";
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        message: "Preview registration complete!",
        userId: newUser.id,
        referralCode,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Preview registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getLeaderboard(1, 1000);
      const totalUsers = users.total;
      const activePreview = users.data.filter(u => u.subscriptionStatus === "active_preview").length;
      const admins = users.data.filter(u => u.role === "admin").length;
      
      res.json({
        totalUsers,
        activePreviewUsers: activePreview,
        admins,
        paymentMode: getPaymentMode(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const country = req.query.country as string;
      const sector = req.query.sector as string;
      
      const result = await storage.getLeaderboard(page, limit, country, sector);
      res.json({
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/context/:rank", async (req, res) => {
    try {
      const rank = parseInt(req.params.rank);
      const range = parseInt(req.query.range as string) || 5;
      const data = await storage.getLeaderboardContext(rank, range);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard context" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const filters = {
        category: req.query.category as string,
        country: req.query.country as string,
        sector: req.query.sector as string,
      };
      const result = await storage.getActivities(page, limit, filters);
      res.json({
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/activities/leaderboard", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const leaderboard = await storage.getActivityLeaderboard(page, limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity leaderboard" });
    }
  });

  app.get("/api/activities/stats", async (req, res) => {
    try {
      const onlyConsented = req.query.consented === "true";
      const stats = await storage.getActivityStats(onlyConsented);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity stats" });
    }
  });

  app.get("/api/activities/user/:userId", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByUser(req.params.userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const parsed = insertActivitySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const activity = await storage.createActivity(parsed.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  app.get("/api/referrals/:userId", async (req, res) => {
    try {
      const referrals = await storage.getReferrals(req.params.userId);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const transactions = await storage.getTransactions(req.params.userId);
      res.json({
        inr: { available: user.walletINRAvailable, pending: user.walletINRPending },
        usd: { available: user.walletUSDAvailable, pending: user.walletUSDPending },
        transactions,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet" });
    }
  });

  // Payment Mode Route
  app.get("/api/payment/mode", (req, res) => {
    const mode = process.env.PAYMENTS_MODE || "mock";
    res.json({ mode });
  });

  // Exchange Rate API (cached, fetches once per day)
  let cachedExchangeRate: { rate: number; date: string; fetchedAt: number } | null = null;
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

  app.get("/api/exchange-rate", async (req, res) => {
    try {
      const now = Date.now();
      
      if (cachedExchangeRate && (now - cachedExchangeRate.fetchedAt) < CACHE_DURATION_MS) {
        return res.json({
          rate: cachedExchangeRate.rate,
          date: cachedExchangeRate.date,
          source: "Frankfurter API (ECB)",
          cached: true,
        });
      }

      const response = await fetch("https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR");
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      
      const data = await response.json();
      const rate = Math.round(data.rates.INR);
      
      cachedExchangeRate = {
        rate,
        date: data.date,
        fetchedAt: now,
      };

      res.json({
        rate,
        date: data.date,
        source: "Frankfurter API (ECB)",
        cached: false,
      });
    } catch (error) {
      console.error("Exchange rate fetch error:", error);
      res.json({
        rate: 84,
        date: new Date().toISOString().split("T")[0],
        source: "Fallback rate",
        cached: true,
      });
    }
  });

  // Pricing API Routes
  app.get("/api/pricing/registration", async (req, res) => {
    try {
      const stakeholderType = (req.query.stakeholderType as string) || "ecosystem";
      const currency = (req.query.currency as string) || "INR";
      
      const priceInfo = await storage.getCurrentPrice(stakeholderType, currency);
      const signupCount = await storage.getSignupCount(stakeholderType);
      const allBrackets = await storage.getPricingBrackets(stakeholderType);
      
      res.json({
        currentPrice: priceInfo.amount,
        currency,
        stakeholderType,
        signupCount,
        bracket: priceInfo.bracket,
        allBrackets: allBrackets.filter(b => b.currency === currency),
      });
    } catch (error) {
      console.error("Pricing fetch error:", error);
      res.status(500).json({ error: "Failed to fetch pricing" });
    }
  });

  // Dynamic pricing stats with countdown and estimated timeline
  app.get("/api/pricing/dynamic-stats", async (req, res) => {
    try {
      const stakeholderType = (req.query.stakeholderType as string) || "ecosystem";
      
      // Use combined signup counts - all ecosystem types share the same price tier
      // Only "professional" type has special pricing
      const isProfessionalType = stakeholderType === 'professional';
      const signupCount = isProfessionalType 
        ? await storage.getProfessionalSignupCount()
        : await storage.getEcosystemSignupCount();
      
      // Use the correct bracket type based on stakeholder
      const bracketType = isProfessionalType ? "professional" : "ecosystem";
      const allBracketsINR = await storage.getPricingBrackets(bracketType);
      const inrBrackets = allBracketsINR.filter(b => b.currency === "INR").sort((a, b) => a.minSignups - b.minSignups);
      const usdBrackets = allBracketsINR.filter(b => b.currency === "USD").sort((a, b) => a.minSignups - b.minSignups);
      
      // Find current and next brackets
      let currentBracketINR = inrBrackets[0];
      let nextBracketINR = inrBrackets[1] || null;
      
      for (let i = 0; i < inrBrackets.length; i++) {
        if (signupCount >= inrBrackets[i].minSignups) {
          currentBracketINR = inrBrackets[i];
          nextBracketINR = inrBrackets[i + 1] || null;
        }
      }
      
      let currentBracketUSD = usdBrackets[0];
      let nextBracketUSD = usdBrackets[1] || null;
      
      for (let i = 0; i < usdBrackets.length; i++) {
        if (signupCount >= usdBrackets[i].minSignups) {
          currentBracketUSD = usdBrackets[i];
          nextBracketUSD = usdBrackets[i + 1] || null;
        }
      }
      
      // Calculate spots remaining
      const spotsRemaining = nextBracketINR ? nextBracketINR.minSignups - signupCount - 1 : 0;
      
      // Estimate registration rate (assume ~5 registrations per day based on historical data)
      const avgRegistrationsPerDay = 5;
      const daysUntilNextTier = spotsRemaining > 0 ? Math.ceil(spotsRemaining / avgRegistrationsPerDay) : 0;
      
      // Calculate estimated date
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + daysUntilNextTier);
      
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('X-Response-Time', new Date().toISOString());
      res.json({
        signupCount,
        currentPriceINR: currentBracketINR?.amount || 999,
        currentPriceUSD: currentBracketUSD?.amount || 14.99,
        nextPriceINR: nextBracketINR?.amount || null,
        nextPriceUSD: nextBracketUSD?.amount || null,
        spotsRemaining: Math.max(0, spotsRemaining),
        nextTierAt: nextBracketINR?.minSignups || null,
        daysUntilNextTier,
        estimatedNextTierDate: daysUntilNextTier > 0 ? estimatedDate.toISOString().split("T")[0] : null,
        avgRegistrationsPerDay,
        isLastTier: !nextBracketINR,
        _debug: {
          timestamp: new Date().toISOString(),
          serverTime: Date.now(),
        }
      });
    } catch (error) {
      console.error("Dynamic pricing stats error:", error);
      res.status(500).json({ error: "Failed to fetch pricing stats" });
    }
  });

  app.get("/api/pricing/tiers", async (req, res) => {
    try {
      const tiers = await storage.getSubscriptionTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription tiers" });
    }
  });

  app.get("/api/pricing/brackets", async (req, res) => {
    try {
      const stakeholderType = req.query.stakeholderType as string;
      const brackets = await storage.getPricingBrackets(stakeholderType);
      res.json(brackets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pricing brackets" });
    }
  });

  // Debug endpoint to diagnose database state
  app.get("/api/debug/db-stats", async (req, res) => {
    try {
      const ecosystemCount = await storage.getEcosystemSignupCount();
      const professionalCount = await storage.getProfessionalSignupCount();
      
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.json({
        timestamp: new Date().toISOString(),
        serverTime: Date.now(),
        counts: {
          ecosystem: ecosystemCount,
          professional: professionalCount,
          total: ecosystemCount + professionalCount,
        },
        env: process.env.NODE_ENV || 'unknown',
        dbConnected: true,
      });
    } catch (error) {
      console.error("Debug stats error:", error);
      res.status(500).json({ error: "Failed to fetch debug stats", details: String(error) });
    }
  });

  // Admin endpoint to cleanup mock users (user*@i2u.ai pattern)
  app.post("/api/admin/cleanup-mock-users", async (req, res) => {
    try {
      const deletedCount = await storage.cleanupMockUsers();
      const newCount = await storage.getEcosystemSignupCount();
      
      res.json({
        success: true,
        deletedMockUsers: deletedCount,
        remainingEcosystemUsers: newCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Cleanup mock users error:", error);
      res.status(500).json({ error: "Failed to cleanup mock users", details: String(error) });
    }
  });

  // Admin endpoint to fix stakeholder_type for professional/job_seeker roles
  app.post("/api/admin/fix-stakeholder-types", async (req, res) => {
    try {
      const fixedCount = await storage.fixProfessionalStakeholderTypes();
      const professionalCount = await storage.getProfessionalSignupCount();
      const ecosystemCount = await storage.getEcosystemSignupCount();
      
      res.json({
        success: true,
        fixedUsers: fixedCount,
        professionalCount,
        ecosystemCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Fix stakeholder types error:", error);
      res.status(500).json({ error: "Failed to fix stakeholder types", details: String(error) });
    }
  });

  // Pending registration (without immediate payment)
  app.post("/api/register/pending", async (req, res) => {
    try {
      const { name, email, phone, role, country, sector, currency, displayPreference, referredBy, paymentMethod, transactionRef } = req.body;
      
      if (!name || !email || !role || !country) {
        return res.status(400).json({ error: "Name, email, role, and country are required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const stakeholderType = ["professional", "job_seeker"].includes(role) ? "professional" : "ecosystem";
      const priceInfo = await storage.getCurrentPrice(stakeholderType, currency || "INR");
      
      const tempPassword = `i2u_${Date.now().toString(36)}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const referralCode = `REF-${Date.now().toString(36).toUpperCase()}`;
      const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
      
      const newUser = await storage.createUser({
        name,
        email,
        phone,
        password: hashedPassword,
        username,
        role: role || "startup",
        stakeholderType,
        country,
        sector: sector || null,
        currency: currency || "INR",
        displayPreference: displayPreference || "real_name",
        referralCode,
        referredBy: referredBy || null,
        subscriptionStatus: "pending_payment",
        planType: "free",
        subscriptionTier: "Free",
        leaderboardRank: 0,
        percentile: 0,
        walletINRAvailable: 0,
        walletINRPending: 0,
        walletUSDAvailable: 0,
        walletUSDPending: 0,
        activityPrivacy: "public_leaderboard",
        registrationFee: priceInfo.amount,
        registrationFeeCurrency: currency || "INR",
      });
      
      if (paymentMethod) {
        await storage.createPaymentIntent({
          userId: newUser.id,
          intentType: "registration",
          paymentMethod,
          status: transactionRef ? "submitted" : "pending",
          amount: priceInfo.amount,
          currency: currency || "INR",
          transactionRef: transactionRef || null,
          upiId: paymentMethod === "manual_upi" ? "girishbh-1@okaxis" : null,
        });
      }
      
      req.session.userId = newUser.id;
      req.session.userEmail = newUser.email;
      req.session.userRole = newUser.role;
      req.session.isAdmin = false;
      req.session.subscriptionStatus = "pending_payment";
      
      console.log(`New pending user registered: ${email} (${role}/${stakeholderType})`);
      
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        success: true,
        message: "Registration received! Complete payment to activate your account.",
        userId: newUser.id,
        referralCode,
        user: userWithoutPassword,
        pendingAmount: priceInfo.amount,
        pendingCurrency: currency || "INR",
      });
    } catch (error) {
      console.error("Pending registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Submit payment proof for pending registration
  app.post("/api/payment/submit-proof", requireAuth, async (req, res) => {
    try {
      const { transactionRef, paymentMethod, proofImageUrl, notes } = req.body;
      const userId = req.session.userId!;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const existingIntents = await storage.getPaymentIntentsByUser(userId);
      const pendingIntent = existingIntents.find(i => i.status === "pending" && i.intentType === "registration");
      
      if (pendingIntent) {
        await storage.updatePaymentIntent(pendingIntent.id, {
          status: "submitted",
          transactionRef,
          proofImageUrl,
          notes,
        });
      } else {
        await storage.createPaymentIntent({
          userId,
          intentType: "registration",
          paymentMethod: paymentMethod || "manual_upi",
          status: "submitted",
          amount: user.registrationFee || 999,
          currency: user.registrationFeeCurrency || "INR",
          transactionRef,
          proofImageUrl,
          notes,
          upiId: "girishbh-1@okaxis",
        });
      }
      
      res.json({ success: true, message: "Payment proof submitted. We will verify and activate your account." });
    } catch (error) {
      console.error("Payment proof submission error:", error);
      res.status(500).json({ error: "Failed to submit payment proof" });
    }
  });

  // Admin: Get pending payments
  app.get("/api/admin/pending-payments", requireAdmin, async (req, res) => {
    try {
      const pendingPayments = await storage.getPendingPaymentIntents();
      res.json(pendingPayments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending payments" });
    }
  });

  // Admin: Verify/Approve payment
  app.post("/api/admin/payment/:intentId/verify", requireAdmin, async (req, res) => {
    try {
      const intentId = parseInt(req.params.intentId);
      const { approved, notes } = req.body;
      const adminId = req.session.userId!;
      
      const intent = await storage.getPaymentIntent(intentId);
      if (!intent) {
        return res.status(404).json({ error: "Payment intent not found" });
      }
      
      if (approved) {
        await storage.updatePaymentIntent(intentId, {
          status: "verified",
          verifiedBy: adminId,
          notes: notes || intent.notes,
        });
        
        if (intent.userId) {
          await storage.updateUser(intent.userId, {
            subscriptionStatus: "active_live",
            planType: "premium",
            paymentAmount: intent.amount,
            paymentCurrency: intent.currency,
          });
        }
        
        res.json({ success: true, message: "Payment verified and user activated" });
      } else {
        await storage.updatePaymentIntent(intentId, {
          status: "failed",
          notes: notes || "Payment rejected by admin",
        });
        res.json({ success: true, message: "Payment rejected" });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Admin: Add followup note
  app.post("/api/admin/payment/:intentId/followup", requireAdmin, async (req, res) => {
    try {
      const intentId = parseInt(req.params.intentId);
      const { followupType, channel, notes } = req.body;
      const adminId = req.session.userId!;
      
      const intent = await storage.getPaymentIntent(intentId);
      if (!intent) {
        return res.status(404).json({ error: "Payment intent not found" });
      }
      
      const followup = await storage.createPaymentFollowup({
        paymentIntentId: intentId,
        userId: intent.userId,
        followupType: followupType || "reminder",
        channel: channel || "email",
        notes,
        createdBy: adminId,
      });
      
      res.json({ success: true, followup });
    } catch (error) {
      res.status(500).json({ error: "Failed to create followup" });
    }
  });

  // Get payment followups for AI agent
  app.get("/api/agent/pending-payments", async (req, res) => {
    try {
      const pendingPayments = await storage.getPendingPaymentIntents();
      res.json({
        count: pendingPayments.length,
        payments: pendingPayments.map(p => ({
          id: p.id,
          userName: p.userName,
          userEmail: p.userEmail,
          userPhone: p.userPhone,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          transactionRef: p.transactionRef,
          createdAt: p.createdAt,
          notes: p.notes,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending payments" });
    }
  });

  // PayPal Integration Routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Cashfree Integration Routes
  app.get("/api/cashfree/config", (req, res) => {
    getCashfreeConfig(req, res);
  });

  app.post("/api/cashfree/order", async (req, res) => {
    await createCashfreeOrder(req, res);
  });

  app.get("/api/cashfree/verify/:orderId", async (req, res) => {
    await verifyCashfreePayment(req, res);
  });

  app.get("/api/cashfree/order/:orderId", async (req, res) => {
    await getCashfreeOrderStatus(req, res);
  });

  app.post("/api/cashfree/webhook", async (req, res) => {
    await handleCashfreeWebhook(req, res);
  });

  app.get("/api/payment/status", (req, res) => {
    res.json(getPaymentGatewayStatus());
  });

  // Blog API Routes
  app.get("/api/blog", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      
      const result = await storage.getBlogArticles(page, limit, category);
      res.json({
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog articles" });
    }
  });

  app.get("/api/blog/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getBlogArticle(id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const parsed = insertBlogArticleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      const article = await storage.createBlogArticle(parsed.data);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.updateBlogArticle(id, req.body);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogArticle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Payment Glitch Flagging Route
  app.post("/api/payment/flag-glitch", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Set the glitch flagged timestamp
      await storage.updateUser(userId, {
        paymentGlitchFlaggedAt: new Date(),
        paymentGlitchResolved: false,
      });
      
      res.json({
        success: true,
        message: "We apologize for the inconvenience. Your payment issue has been flagged and you will receive bonus credits for the delay.",
        flaggedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Flag glitch error:", error);
      res.status(500).json({ error: "Failed to flag payment issue" });
    }
  });

  // Get pending payment status with bonus calculation
  app.get("/api/payment/pending-status", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const hasPendingPayment = user.subscriptionStatus === "pending_payment";
      const awaitingInr = user.awaitingPaymentInr;
      const awaitingUsd = user.awaitingPaymentUsd;
      const glitchFlaggedAt = user.paymentGlitchFlaggedAt;
      const glitchResolved = user.paymentGlitchResolved;
      
      // Calculate bonus based on delay
      let bonusPercent = 0;
      let delayHours = 0;
      let delayDays = 0;
      
      if (glitchFlaggedAt && !glitchResolved) {
        const flaggedTime = new Date(glitchFlaggedAt).getTime();
        const now = Date.now();
        delayHours = Math.floor((now - flaggedTime) / (1000 * 60 * 60));
        delayDays = Math.floor(delayHours / 24);
        
        // 20% bonus for flagging (always given when flagged)
        // + 20% for each additional 24 hours of delay from our side
        bonusPercent = 20 + (delayDays * 20);
        
        // Genuine Payment Efforts Bonus: starts at 30%, reduces by 5% every 24 hours
        // Day 0 (within 24 hrs): 30%, Day 1: 25%, Day 2: 20%, Day 3: 15%, etc.
        const genuineEffortsBonus = Math.max(0, 30 - (delayDays * 5));
        bonusPercent += genuineEffortsBonus;
      }
      
      // Payment amounts (matching registration requirements)
      const AMOUNTS = {
        INR: 8199,
        USD: 99,
      };
      
      res.json({
        hasPendingPayment,
        awaitingInr,
        awaitingUsd,
        glitchFlaggedAt,
        glitchResolved,
        delayHours,
        delayDays,
        bonusPercent,
        amounts: AMOUNTS,
        currency: user.currency,
        registrationFee: user.registrationFee,
        registrationFeeCurrency: user.registrationFeeCurrency,
      });
    } catch (error) {
      console.error("Pending status error:", error);
      res.status(500).json({ error: "Failed to fetch payment status" });
    }
  });

  // Complete pending payment and apply bonuses
  app.post("/api/payment/complete-pending", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { paymentId, paymentProvider } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Verify payment
      let paymentVerified = false;
      let verifiedAmount = 0;
      let verifiedCurrency = "";
      
      if (paymentProvider === "paypal") {
        const verification = await verifyPayPalPaymentById(paymentId);
        paymentVerified = verification.success;
        verifiedAmount = parseFloat(verification.amount || "0");
        verifiedCurrency = verification.currency || "";
      } else if (paymentProvider === "cashfree") {
        const verification = await verifyCashfreePaymentById(paymentId);
        paymentVerified = verification.success;
        verifiedAmount = verification.amount || 0;
        verifiedCurrency = verification.currency || "INR";
      }
      
      if (!paymentVerified) {
        return res.status(402).json({ error: "Payment verification failed" });
      }
      
      // Calculate and apply bonuses
      let bonusAmount = 0;
      let bonusPercent = 0;
      const glitchFlaggedAt = user.paymentGlitchFlaggedAt;
      
      if (glitchFlaggedAt && !user.paymentGlitchResolved) {
        const flaggedTime = new Date(glitchFlaggedAt).getTime();
        const now = Date.now();
        const delayHours = Math.floor((now - flaggedTime) / (1000 * 60 * 60));
        const delayDays = Math.floor(delayHours / 24);
        
        // 20% for flagging + 20% per day delay from our side
        bonusPercent = 20 + (delayDays * 20);
        
        // Genuine Payment Efforts Bonus: starts at 30%, reduces by 5% every 24 hours
        const genuineEffortsBonus = Math.max(0, 30 - (delayDays * 5));
        bonusPercent += genuineEffortsBonus;
        
        bonusAmount = verifiedAmount * (bonusPercent / 100);
      }
      
      // Update user with payment and bonus
      const updateData: any = {
        subscriptionStatus: "active",
        planType: "paid",
        subscriptionTier: "premium",
        paymentId,
        paymentProvider,
        paymentAmount: verifiedAmount,
        paymentCurrency: verifiedCurrency,
        awaitingPaymentInr: false,
        awaitingPaymentUsd: false,
        paymentGlitchResolved: true,
      };
      
      // Add bonus to wallet
      if (bonusAmount > 0) {
        if (verifiedCurrency === "INR") {
          updateData.walletINRAvailable = (user.walletINRAvailable || 0) + bonusAmount;
        } else {
          updateData.walletUSDAvailable = (user.walletUSDAvailable || 0) + bonusAmount;
        }
        
        // Create bonus transaction
        await storage.createTransaction({
          userId,
          type: "payment_delay_bonus",
          amount: bonusAmount,
          currency: verifiedCurrency,
          status: "completed",
        });
      }
      
      await storage.updateUser(userId, updateData);
      
      // Activate referral bonus for the referrer now that payment is complete
      if (user.referredBy) {
        const referrer = await storage.getUserByReferralCode(user.referredBy);
        if (referrer) {
          // Calculate referral bonus (10% of payment)
          const referralBonus = verifiedAmount * 0.10;
          
          if (verifiedCurrency === "INR") {
            await storage.updateUser(referrer.id, {
              walletINRAvailable: (referrer.walletINRAvailable || 0) + referralBonus,
              referralCount: (referrer.referralCount || 0) + 1,
            });
          } else {
            await storage.updateUser(referrer.id, {
              walletUSDAvailable: (referrer.walletUSDAvailable || 0) + referralBonus,
              referralCount: (referrer.referralCount || 0) + 1,
            });
          }
          
          // Create referral transaction
          await storage.createTransaction({
            userId: referrer.id,
            type: "referral_bonus",
            amount: referralBonus,
            currency: verifiedCurrency,
            status: "completed",
          });
          
          // Update referral record status
          const existingReferrals = await storage.getReferrals(referrer.id);
          const referralRecord = existingReferrals.find(r => r.referredId === userId);
          if (!referralRecord) {
            await storage.createReferral({
              referrerId: referrer.id,
              referredId: userId,
              earningsINR: verifiedCurrency === "INR" ? referralBonus : 0,
              earningsUSD: verifiedCurrency === "USD" ? referralBonus : 0,
              status: "completed",
            });
          }
        }
      }
      
      req.session.subscriptionStatus = "active";
      
      res.json({
        success: true,
        message: bonusAmount > 0 
          ? `Payment verified! You received a ${bonusPercent}% bonus (${verifiedCurrency === "INR" ? "₹" : "$"}${bonusAmount.toFixed(2)}) for your patience.`
          : "Payment verified and account activated!",
        bonusAmount,
        bonusPercent,
      });
    } catch (error) {
      console.error("Complete pending payment error:", error);
      res.status(500).json({ error: "Failed to complete payment" });
    }
  });

  // Bank transfer details for manual payment
  app.get("/api/payment/bank-details", (req, res) => {
    res.json({
      inr: {
        bankName: "i2u.ai Banking Partner",
        accountName: "i2u Technologies Pvt Ltd",
        accountNumber: "XXXX-XXXX-XXXX-1234",
        ifscCode: "HDFC0001234",
        upiId: "payments@i2u.ai",
      },
      usd: {
        bankName: "International Bank",
        accountName: "i2u Technologies Inc",
        swift: "HDFCINBBXXX",
        routingNumber: "123456789",
        accountNumber: "9876543210",
      },
      note: "Please include your email in the payment reference. Manual payments are verified within 24-48 hours.",
    });
  });

  // Suggestions & Ideas API Routes
  app.get("/api/suggestions", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const category = req.query.category as string;
      
      const result = await storage.getSuggestions(page, limit, status, category);
      res.json({
        data: result.data,
        total: result.total,
        page,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  app.get("/api/suggestions/best/:period", async (req, res) => {
    try {
      const period = req.params.period;
      const limit = parseInt(req.query.limit as string) || 10;
      const suggestions = await storage.getBestSuggestions(period, limit);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch best suggestions" });
    }
  });

  app.get("/api/suggestions/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const suggestions = await storage.getUserSuggestions(userId);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user suggestions" });
    }
  });

  app.post("/api/suggestions", async (req, res) => {
    try {
      const userId = req.session?.userId;
      const { title, content, category, guestName, guestEmail, guestPhone, guestCountryCode } = req.body;
      
      if (!userId && !guestEmail && !guestPhone) {
        return res.status(400).json({ error: "Please provide an email or phone number" });
      }
      
      const suggestionData = {
        title,
        content,
        category: category || "General Feedback",
        userId: userId || null,
        guestName: !userId ? guestName : null,
        guestEmail: !userId ? guestEmail : null,
        guestPhone: !userId ? guestPhone : null,
        guestCountryCode: !userId ? guestCountryCode : null,
      };
      
      const parsed = insertSuggestionSchema.safeParse(suggestionData);
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const suggestion = await storage.createSuggestion(parsed.data);
      res.status(201).json(suggestion);
    } catch (error) {
      console.error("Create suggestion error:", error);
      res.status(500).json({ error: "Failed to create suggestion" });
    }
  });

  app.put("/api/suggestions/:id/edit", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId!;
      const { title, content, category } = req.body;
      
      const existing = await storage.getSuggestion(id);
      if (!existing) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "You can only edit your own suggestions" });
      }
      
      if (existing.status !== "pending") {
        return res.status(400).json({ error: "Can only edit suggestions that are still pending" });
      }
      
      const updated = await storage.updateSuggestion(id, { title, content, category });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update suggestion" });
    }
  });

  app.delete("/api/suggestions/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      const existing = await storage.getSuggestion(id);
      if (!existing) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ error: "You can only delete your own suggestions" });
      }
      
      if (existing.status !== "pending") {
        return res.status(400).json({ error: "Can only delete suggestions that are still pending" });
      }
      
      await storage.deleteSuggestion(id);
      res.json({ success: true, message: "Suggestion deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete suggestion" });
    }
  });

  app.post("/api/suggestions/:id/vote", requireAuth, async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      const success = await storage.voteSuggestion(suggestionId, userId);
      
      if (!success) {
        return res.status(400).json({ error: "You have already voted on this suggestion" });
      }
      
      res.json({ success: true, message: "Vote recorded" });
    } catch (error) {
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  app.put("/api/suggestions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const suggestion = await storage.updateSuggestion(id, req.body);
      
      if (!suggestion) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      
      res.json(suggestion);
    } catch (error) {
      res.status(500).json({ error: "Failed to update suggestion" });
    }
  });

  app.post("/api/suggestions/:id/award", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { rewardInr, rewardUsd, period } = req.body;
      
      if (!period) {
        return res.status(400).json({ error: "Recognition period is required" });
      }
      
      const validPeriods = ["hour", "day", "week", "month", "quarter", "half_year", "year", "2_years", "3_years", "4_years", "5_years", "decade"];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ error: "Invalid recognition period" });
      }
      
      const inrAmount = Math.max(0, Number(rewardInr) || 0);
      const usdAmount = Math.max(0, Number(rewardUsd) || 0);
      
      if (inrAmount === 0 && usdAmount === 0) {
        return res.status(400).json({ error: "At least one reward amount must be greater than 0" });
      }
      
      const suggestion = await storage.awardSuggestion(id, inrAmount, usdAmount, period);
      
      if (!suggestion) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      
      res.json({ 
        success: true, 
        message: `Suggestion awarded as Best of ${period}`,
        suggestion 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to award suggestion" });
    }
  });

  app.post("/api/suggestions/:id/react", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const { reactionType, guestSessionId } = req.body;
      
      if (!["thumbs_up", "thumbs_down"].includes(reactionType)) {
        return res.status(400).json({ error: "Invalid reaction type" });
      }
      
      const userId = req.session.userId;
      
      if (!userId && !guestSessionId) {
        return res.status(400).json({ error: "Either login or provide a session ID" });
      }
      
      const reaction = await storage.addReaction(suggestionId, reactionType, userId, guestSessionId);
      const counts = await storage.getReactionCounts(suggestionId);
      
      res.json({ success: true, reaction, counts });
    } catch (error) {
      res.status(500).json({ error: "Failed to add reaction" });
    }
  });

  app.delete("/api/suggestions/:id/react", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const { guestSessionId } = req.body;
      const userId = req.session.userId;
      
      if (!userId && !guestSessionId) {
        return res.status(400).json({ error: "Either login or provide a session ID" });
      }
      
      await storage.removeReaction(suggestionId, userId, guestSessionId);
      const counts = await storage.getReactionCounts(suggestionId);
      
      res.json({ success: true, counts });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove reaction" });
    }
  });

  app.get("/api/suggestions/:id/reactions", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const { guestSessionId } = req.query;
      const userId = req.session.userId;
      
      const counts = await storage.getReactionCounts(suggestionId);
      const userReaction = await storage.getUserReaction(suggestionId, userId, guestSessionId as string);
      
      res.json({ counts, userReaction: userReaction?.reactionType || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to get reactions" });
    }
  });

  app.get("/api/suggestions/:id/comments", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const comments = await storage.getComments(suggestionId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get comments" });
    }
  });

  app.post("/api/suggestions/:id/comments", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const { content, guestName, guestEmail } = req.body;
      const userId = req.session.userId;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Comment content is required" });
      }
      
      if (!userId && (!guestName || guestName.trim().length === 0)) {
        return res.status(400).json({ error: "Please provide your name to comment" });
      }
      
      const comment = await storage.addComment({
        suggestionId,
        userId: userId || null,
        guestName: userId ? null : guestName.trim(),
        guestEmail: userId ? null : (guestEmail || null),
        content: content.trim(),
      });
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  app.delete("/api/suggestions/:id/comments/:commentId", requireAuth, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.session.userId!;
      
      await storage.deleteComment(commentId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  return httpServer;
}
