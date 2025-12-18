import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { CheckCircle, Phone, Mail, Globe, MapPin, MessageCircle, Shield, AlertTriangle } from "lucide-react";

export default function Terms() {
  return (
    <PageWithSidePanels>
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms and Conditions</h1>
        <p className="text-lg text-muted-foreground">Comprehensive Payment Gateway Compliant Version</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> RBI Compliant
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Cashfree Compliant
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> GoI Compliant
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          <strong>Last Updated:</strong> December 16, 2025 | <strong>Effective Date:</strong> December 16, 2025
        </p>
      </div>

      {/* Section 1: Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1. Introduction & Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p>
            Welcome to <strong>i2u.ai</strong> ("Ideas to Unicorns through AI"), a technology platform for professional networking, 
            referral programs, and knowledge sharing. These comprehensive Terms and Conditions ("Terms") govern your use of our 
            platform, services, features, and all related functionalities.
          </p>
          
          <h3 className="font-semibold text-lg">1.1 Acceptance of Terms</h3>
          <p>By accessing, browsing, registering on, or using any part of i2u.ai (the "Platform"), you acknowledge that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You have read and understood these Terms and Conditions</li>
            <li>You agree to be bound by all terms herein</li>
            <li>You are legally capable of entering into binding agreements</li>
            <li>You meet the minimum age requirement (18 years or older)</li>
            <li>You are not a resident of a jurisdiction where our services are prohibited</li>
          </ul>
          <p className="text-red-600 dark:text-red-400 font-medium">
            <strong>Non-acceptance:</strong> If you do not agree to these terms, you must immediately cease using the Platform.
          </p>

          <h3 className="font-semibold text-lg">1.2 Incorporation of Other Policies</h3>
          <p>These Terms incorporate and include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Our Privacy Policy</li>
            <li>Our Referral Program Terms</li>
            <li>Our Refund and Cancellation Policy</li>
            <li>Our Anti-Fraud Policy</li>
            <li>Our Community Guidelines</li>
          </ul>
          <p>All policies are available on the Platform and are binding.</p>
        </CardContent>
      </Card>

      {/* Section 2: Refund and Cancellation Policy */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            2. Refund and Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 pt-4">
          <h3 className="font-semibold text-lg">2.1 Refund Eligibility</h3>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Eligible for Refund:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Registration fees paid directly to i2u.ai within 7 days of payment</li>
              <li>Subscription fees if service not yet activated</li>
              <li>Duplicate payments (auto-detected within 48 hours)</li>
              <li>Failed transactions charged but service not delivered</li>
              <li>Technical errors resulting in unauthorized charges</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">NOT Eligible for Refund:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Referral bonuses (considered earned income, non-refundable)</li>
              <li>Promotional credits or discounts used</li>
              <li>Services already rendered and used</li>
              <li>Withdrawals already processed</li>
              <li>Payments made to resolve disputes or penalties</li>
              <li>User-initiated subscription downgrades (cancellation applies)</li>
            </ul>
          </div>

          <h3 className="font-semibold text-lg">2.2 Refund Process and Timeline</h3>
          <p><strong>Refund Request Submission:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Contact our support team within 7 days of transaction</li>
            <li>Provide: Transaction ID, payment method, amount, reason for refund</li>
            <li>Email: support@i2u.ai</li>
            <li>Phone: +91 7760937549</li>
            <li>WhatsApp: +91 7760937549 (for urgent matters)</li>
          </ul>

          <p><strong>Processing Timeline:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bank transfer refunds: 5-7 business days</li>
            <li>PayPal refunds: 3-5 business days</li>
            <li>Credit card refunds: 7-14 business days (bank dependent)</li>
            <li>Cashfree gateway refunds: 2-3 business days</li>
          </ul>

          <p><strong>Important:</strong> i2u.ai initiates refund to original payment method. i2u.ai bears all refund processing charges.</p>

          <h3 className="font-semibold text-lg">2.3 Refund Status Tracking</h3>
          <p>Users can track refund status via:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email updates (automatic at each stage)</li>
            <li>Account dashboard (refund status section)</li>
            <li>Support team inquiry (+91 7760937549)</li>
          </ul>

          <h3 className="font-semibold text-lg">2.4 Partial Refund Policy</h3>
          <p>For partially utilized annual subscriptions:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Refund calculated on pro-rata basis</li>
            <li>Days remaining ÷ Days in subscription = Refund %</li>
            <li>Example: 6-month paid, cancellation after 2 months = 66.67% refund</li>
            <li>Deductions: Referral bonuses earned, promotional discounts applied</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 3: Pricing and Subscription Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">3. Pricing and Subscription Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">3.1 Pricing Structure</h3>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
            <p className="font-bold text-green-700 dark:text-green-400 text-lg flex items-center gap-2">
              <span className="text-2xl">🚀</span> Limited-Time Launch Pricing!
            </p>
            <p className="text-sm mt-2">
              <strong>Standard Price:</strong> <span className="line-through text-muted-foreground">₹15,999/year ($239.99/year)</span>
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              Enjoy heavily discounted launch prices during our founding member enrollment period.
            </p>
          </div>

          <p><strong>Launch Registration Fee:</strong></p>
          <p className="text-lg">
            <span className="font-bold text-green-600">Upto ₹9,999</span> - Basic access, standard features
          </p>
          
          <p className="text-sm text-muted-foreground italic mt-2">
            * Launch pricing valid for founding members. Standard pricing (₹15,999/$239.99) will apply after launch period ends.
          </p>

          <p><strong>Fee Slab Adjustments:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fees may increase by maximum 15% annually based on inflation, platform enhancements, and market conditions</li>
            <li>Users notified 30 days before fee increase</li>
            <li>Existing subscriptions honored at previous rate for 90 days</li>
          </ul>

          <h3 className="font-semibold text-lg">3.2 Annual vs. Monthly Billing</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Annual billing: Full year's fee charged upfront</li>
            <li>Monthly equivalent pricing displayed for reference only</li>
            <li>Monthly subscription option available at +25% premium</li>
          </ul>

          <h3 className="font-semibold text-lg">3.3 Taxes, Levies, and Government Charges</h3>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <p className="font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              All prices displayed are EXCLUSIVE of taxes
            </p>
            <p className="text-sm mt-2">User is responsible for all applicable taxes including:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>GST (Goods and Services Tax) - 18% for digital services in India</li>
              <li>VAT (Value Added Tax)</li>
              <li>Sales tax and other government levies</li>
            </ul>
            <p className="text-sm mt-2"><strong>Example Calculation:</strong> Base fee ₹999 + GST (18%) ₹179.82 = <strong>Total ₹1,178.82</strong></p>
          </div>

          <h3 className="font-semibold text-lg">3.4 Currency and Payment Methods</h3>
          <p><strong>Domestic (India) - via Cashfree:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Credit Cards (Visa, Mastercard, Amex)</li>
            <li>Debit Cards (all banks)</li>
            <li>UPI (PayTM, Google Pay, PhonePe, Bhim)</li>
            <li>Net Banking (all NEFT/RTGS enabled banks)</li>
            <li>Wallets (PayTM, Amazon Pay)</li>
            <li>Currency: Indian Rupees (INR)</li>
          </ul>

          <p><strong>International - via PayPal:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Credit Cards (Visa, Mastercard)</li>
            <li>PayPal, Wise (formerly TransferWise)</li>
            <li>Currency: US Dollars (USD)</li>
            <li>Conversion rate determined by payment gateway at transaction time</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 4: Referral Bonus Program */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">4. Referral Bonus Program Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">4.1 Referral Bonus Structure</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Direct referral bonus:</strong> 20% of registration fee paid by referred user</li>
            <li>Calculated on fee tier only (excluding taxes)</li>
            <li>Example: Referral pays ₹999 → Referrer earns ₹199.80 (20% of ₹999)</li>
            <li><strong>Single-level only:</strong> No MLM multi-level earning structure</li>
          </ul>

          <h3 className="font-semibold text-lg">4.2 Bonus Calculation and Crediting</h3>
          <p><strong>Crediting Timeline:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bonus appears in pending wallet: Within 24 hours of registration</li>
            <li>Bonus confirmed after referral completes 30 days: Day 30</li>
            <li>Status: "Pending" → "Available" (after 30 days)</li>
          </ul>

          <p><strong>Conditions for Bonus Confirmation:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Referral completes all registration steps</li>
            <li>Referral's payment successfully processed</li>
            <li>Referral remains active for minimum 30 days</li>
            <li>No fraud or policy violation detected</li>
          </ul>

          <h3 className="font-semibold text-lg">4.3 Fraud Detection</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Self-referral (same person, multiple accounts): Detected and blocked</li>
            <li>Referral farm abuse: Flagged and reversed</li>
            <li>Invalid data: Rejected before crediting</li>
            <li>Suspicious patterns: Manual review triggered</li>
          </ul>

          <h3 className="font-semibold text-lg">4.4 Bonus Withdrawal and Payout</h3>
          <p><strong>Payout Methods:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Bank Transfer (NEFT/RTGS):</strong> 2-3 business days, Minimum ₹500</li>
            <li><strong>PayPal (International):</strong> 2-5 business days, Minimum $10 USD</li>
            <li><strong>Wallet Credit:</strong> Instant application to platform services</li>
          </ul>

          <p><strong>Tax Withholding:</strong> For high earners (₹50,000+ annually):</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>TDS (Tax Deducted at Source) 10% applied per Section 194O</li>
            <li>PAN verification required</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 5: Benefits and Value Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">5. Benefits and Value Calculations</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">5.1 Indicative Pricing and Estimates</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="font-semibold">Disclaimer on Calculated Values:</p>
            <p className="text-sm">All benefits, scores, rankings, and monetary values displayed on i2u.ai are:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Indicative and estimated</strong> (not guaranteed)</li>
              <li>Based on proprietary algorithms</li>
              <li>Subject to change without notice</li>
              <li>Provided for informational purposes only</li>
              <li>Not constituting warranties or promises</li>
            </ul>
          </div>

          <h3 className="font-semibold text-lg">5.2 Calculation Methodology</h3>
          <p>Factors used in calculations:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Available market pricing data</li>
            <li>Repute and credibility scores</li>
            <li>Quality assessments and community ratings</li>
            <li>Industry benchmarks and standards</li>
            <li>User engagement metrics</li>
            <li>Platform contribution history</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 6: Payment Gateway Compliance */}
      <Card className="border-2 border-blue-500/20">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            6. Payment Gateway Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 pt-4">
          <h3 className="font-semibold text-lg">6.1 Cashfree Integration</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cashfree's Terms of Service incorporated by reference</li>
            <li>i2u.ai complies with all Cashfree requirements</li>
            <li>PCI DSS compliance maintained (Level 1)</li>
            <li>Payment Card Industry Data Security Standard compliant</li>
          </ul>

          <h3 className="font-semibold text-lg">6.2 RBI Compliance</h3>
          <p><strong>Reserve Bank of India Requirements:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Payment aggregator model compliant</li>
            <li>KYC verification for all users</li>
            <li>Transaction monitoring for AML (Anti-Money Laundering)</li>
            <li>CTR (Cash Transaction Report) filing for transactions {'>'}₹10 Lakh</li>
            <li>RBI circular 2021-22 (Payment Systems): Compliant</li>
            <li>Data retention policy: 7 years per RBI requirement</li>
            <li>Secure payment protocols: SSL/TLS encryption mandatory</li>
          </ul>

          <h3 className="font-semibold text-lg">6.3 Government of India Compliance</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>GST registration mandatory</li>
            <li>TDS compliance per Income Tax Act</li>
            <li>E-wallet guidelines compliance</li>
            <li>Consumer Protection Act, 2019 compliance</li>
            <li>Information Technology Act, 2000 compliance</li>
            <li>Data localization requirements: All data stored in India</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 7: Contact Information */}
      <Card className="border-2 border-green-500/20">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-2xl">7. Contact Information and Customer Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" /> Email Support
              </h4>
              <ul className="text-sm space-y-1">
                <li><strong>Primary:</strong> support@i2u.ai</li>
                <li><strong>Escalation:</strong> escalation@i2u.ai</li>
                <li><strong>Refund inquiries:</strong> refunds@i2u.ai</li>
                <li><strong>Complaints:</strong> complaints@i2u.ai</li>
              </ul>
              <p className="text-xs text-muted-foreground">Response time: Within 24 hours</p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" /> Phone Support
              </h4>
              <p className="text-lg font-bold text-primary">+91 7760937549</p>
              <p className="text-sm">Available: Monday-Friday, 9 AM - 6 PM IST</p>
              <p className="text-sm">Weekend: Urgent matters only</p>
              <p className="text-xs text-muted-foreground">Response time: Within 4 business hours</p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" /> WhatsApp Support
              </h4>
              <p className="text-lg font-bold text-green-600">+91 7760937549</p>
              <p className="text-sm">Quick inquiries and status updates</p>
              <p className="text-sm">Monday-Friday, 10 AM - 5 PM IST</p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Mailing Address
              </h4>
              <p className="text-sm">
                <strong>Girish Balappa Hukkeri</strong><br />
                64, 2nd Cross, 2nd Stage, BEML Layout,<br />
                Basaveshwara Nagar, Bangalore - 560 079
              </p>
              <h4 className="font-semibold flex items-center gap-2 mt-3">
                <Globe className="h-5 w-5 text-primary" /> Website
              </h4>
              <p className="text-sm">www.i2u.ai</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: User Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">8. User Responsibilities and Code of Conduct</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">8.1 User Obligations</h3>
          <p>By using i2u.ai, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide truthful, accurate information during registration</li>
            <li>Update information if circumstances change</li>
            <li>Maintain confidentiality of login credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>No illegal activities or fraudulent conduct</li>
            <li>No money laundering or terrorist financing</li>
          </ul>

          <h3 className="font-semibold text-lg">8.2 Prohibited Activities</h3>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Users strictly prohibited from:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Creating multiple accounts (each user: 1 account only)</li>
              <li>Self-referral schemes or referral farming</li>
              <li>Fraudulent or misleading referrals</li>
              <li>Spam or mass unsolicited outreach</li>
              <li>Violating intellectual property rights</li>
              <li>Hacking or unauthorized system access</li>
              <li>Impersonation or identity fraud</li>
              <li>Chargebacks on legitimate transactions</li>
              <li>Abusive or harassing behavior toward others</li>
            </ul>
          </div>

          <p><strong>Consequences of Violation:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Warning (first offense)</li>
            <li>Temporary account suspension (second offense)</li>
            <li>Permanent account termination (third offense)</li>
            <li>Referral bonuses clawed back</li>
            <li>Legal action for serious violations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 9: Limitation of Liability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">9. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">9.1 Disclaimer of Warranties</h3>
          <p>
            The Platform is provided <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> without any warranties, 
            express or implied. i2u.ai disclaims all warranties including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Merchantability or fitness for particular purpose</li>
            <li>Non-infringement of third-party rights</li>
            <li>Accuracy, completeness, or timeliness of information</li>
            <li>Uninterrupted or error-free service</li>
          </ul>

          <h3 className="font-semibold text-lg">9.2 Limitation of Liability</h3>
          <p><strong>TO THE FULLEST EXTENT PERMITTED BY LAW, i2u.ai SHALL NOT BE LIABLE FOR:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Loss of profits, revenue, or earnings</li>
            <li>Loss of business opportunities or contracts</li>
            <li>Loss of data, information, or documents</li>
            <li>Service interruptions or technical failures</li>
            <li>Reliance on calculated benefits or estimates</li>
          </ul>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <p className="font-semibold">MAXIMUM LIABILITY CAP:</p>
            <p className="text-sm">
              i2u.ai's total liability for any claim shall not exceed the amount actually paid by the user in the 
              12 months preceding the claim, or ₹10,000, whichever is lower.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Changes to Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">10. Changes to Terms and Pricing</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <p><strong>i2u.ai reserves the right to:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Modify, update, or discontinue any features</li>
            <li>Change pricing and subscription plans</li>
            <li>Alter referral commission rates</li>
            <li>Update benefit calculations and platform algorithms</li>
          </ul>

          <h3 className="font-semibold text-lg">Notice of Changes</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Material changes: 30 days advance notice</li>
            <li>Minor changes: 7 days advance notice</li>
            <li>Emergency changes (security): Immediate</li>
            <li>Notification method: Email + in-app notification</li>
          </ul>

          <p><strong>Fee Increase Policy:</strong> Maximum 15% annual increase. Existing subscriptions honored at previous rate for 90 days.</p>
        </CardContent>
      </Card>

      {/* Section 11: Governing Law */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">11. Governing Law and Dispute Resolution</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">11.1 Governing Law</h3>
          <p>These Terms governed by laws of India, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Indian Contract Act, 1872</li>
            <li>Consumer Protection Act, 2019</li>
            <li>Information Technology Act, 2000</li>
            <li>Reserve Bank of India regulations</li>
          </ul>

          <h3 className="font-semibold text-lg">11.2 Dispute Resolution Process</h3>
          <p><strong>Step 1: Informal Resolution (14 days)</strong> - Contact customer support</p>
          <p><strong>Step 2: Formal Grievance (30 days)</strong> - Submit written complaint to escalation@i2u.ai</p>
          <p><strong>Step 3: Arbitration</strong> - Conducted under Arbitration and Conciliation Act, 1996, Location: Bangalore</p>

          <h3 className="font-semibold text-lg">11.3 Exclusive Jurisdiction</h3>
          <p className="font-medium">
            All disputes shall be subject to exclusive jurisdiction of the District Courts of Bangalore, Karnataka.
          </p>
        </CardContent>
      </Card>

      {/* Section 12: Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">12. Data Privacy and Protection</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">12.1 Personal Data Collection</h3>
          <p>Data Collected:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, email, phone number</li>
            <li>Address and identification (KYC)</li>
            <li>Bank account or payment details</li>
            <li>Transaction history</li>
            <li>Platform usage and engagement data</li>
            <li>Device information and IP address</li>
          </ul>

          <h3 className="font-semibold text-lg">12.2 Data Protection Measures</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>SSL/TLS encryption for data in transit</li>
            <li>256-bit encryption for stored data</li>
            <li>Firewall protection and regular security audits</li>
            <li>PCI DSS Level 1 compliance</li>
            <li>Data retention: 7 years (RBI requirement)</li>
          </ul>

          <h3 className="font-semibold text-lg">12.3 Third-Party Sharing</h3>
          <p>Data shared with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cashfree (payment processing)</li>
            <li>Banks (settlement and verification)</li>
            <li>Tax authorities (TDS/GST compliance)</li>
            <li>Legal authorities (if required)</li>
          </ul>
          <p><strong>Data NOT shared:</strong> Marketing partners (unless opted in), data brokers, non-compliant third parties.</p>
        </CardContent>
      </Card>

      {/* Section 13: KYC/AML Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">13. KYC and AML Compliance</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">13.1 Anti-Money Laundering (AML)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Customer Due Diligence (CDD) mandatory</li>
            <li>KYC verification before first transaction</li>
            <li>Sanctions list screening</li>
            <li>Transaction monitoring for suspicious patterns</li>
            <li>CTR filing for transactions {'>'}₹10 Lakh</li>
          </ul>

          <h3 className="font-semibold text-lg">13.2 Know Your Customer (KYC)</h3>
          <p><strong>KYC Information Required:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full legal name (as per government ID)</li>
            <li>Date of birth</li>
            <li>Address (current residential)</li>
            <li>Government ID: PAN or Aadhar</li>
            <li>Phone number (verified via OTP)</li>
            <li>Email address (verified via link)</li>
          </ul>

          <p><strong>KYC Verification Timeline:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Basic verification: Instant (email/phone)</li>
            <li>Advanced verification: 24-48 hours</li>
            <li>Manual verification: Up to 5 business days</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 14: International Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">14. Special Terms for International Users</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">14.1 Currency and Payment</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>USD currency mandatory for international users</li>
            <li>PayPal, Wise, or credit cards only</li>
            <li>Exchange rate determined by payment processor</li>
            <li>User responsible for currency conversion fees</li>
          </ul>

          <h3 className="font-semibold text-lg">14.2 Tax Compliance</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>GST/VAT: Not applicable to non-India residents</li>
            <li>FATCA compliance: Required for US persons</li>
            <li>Local tax obligations: User's responsibility</li>
          </ul>

          <h3 className="font-semibold text-lg">14.3 Geographic Restrictions</h3>
          <p>Service not available in OFAC-sanctioned countries: North Korea, Iran, Syria, Sudan, Cuba</p>
        </CardContent>
      </Card>

      {/* Section 15: Termination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">15. Termination and Account Closure</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">15.1 Voluntary Termination</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>User may close account anytime via support@i2u.ai</li>
            <li>Termination effective immediately</li>
            <li>Available bonuses: Paid out within 30 days</li>
            <li>Pending referral bonuses forfeited (if within 14-day pending period)</li>
          </ul>

          <h3 className="font-semibold text-lg">15.2 Involuntary Termination</h3>
          <p>i2u.ai may terminate if user:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violates these terms or policies</li>
            <li>Engages in fraudulent activity</li>
            <li>Uses multiple accounts</li>
            <li>Multiple chargebacks or disputes</li>
            <li>Non-compliance with KYC requirements</li>
            <li>Inactivity: No login for 24 months</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 16: Final Provisions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">16. Final Provisions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <h3 className="font-semibold text-lg">16.1 Entire Agreement</h3>
          <p>
            These Terms and Conditions constitute the entire agreement between user and i2u.ai regarding use of the Platform, 
            services provided, referral bonuses, pricing, and dispute resolution. All previous agreements are superseded.
          </p>

          <h3 className="font-semibold text-lg">16.2 Severability</h3>
          <p>
            If any provision is found invalid or unenforceable, that provision shall be modified to maximum extent permitted. 
            Remaining provisions continue in full force.
          </p>

          <h3 className="font-semibold text-lg">16.3 Waiver</h3>
          <p>Failure to enforce any right does not constitute waiver of that right.</p>

          <h3 className="font-semibold text-lg">16.4 Assignment</h3>
          <p>User may not assign rights or obligations under these terms. i2u.ai may assign to successor company (notice provided).</p>
        </CardContent>
      </Card>

      {/* Section 17: Acknowledgment */}
      <Card className="border-2 border-primary/30">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">17. Acknowledgment and Acceptance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="font-medium">By using i2u.ai, you explicitly acknowledge and accept:</p>
          <div className="grid gap-2">
            {[
              "You have read and understood all terms in this document",
              "You agree to be legally bound by these terms",
              "You are 18 years or older",
              "You meet all eligibility requirements",
              "You understand risks of online transactions",
              "You provide accurate and truthful information",
              "You are responsible for account security",
              "You understand pricing is exclusive of taxes",
              "You understand all calculated values are indicative",
              "You understand refund eligibility limits",
              "You consent to jurisdiction in Bangalore courts",
              "You authorize data processing for compliance",
              "You have read Privacy Policy and Anti-Fraud Policy",
              "You understand referral bonus program terms"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Quick Reference Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="font-semibold">Email</p>
              <p className="text-sm">support@i2u.ai</p>
              <p className="text-xs text-muted-foreground">refunds@i2u.ai</p>
            </div>
            <div>
              <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="font-semibold">Phone / WhatsApp</p>
              <p className="text-sm font-bold">+91 7760937549</p>
              <p className="text-xs text-muted-foreground">Mon-Fri 9 AM - 6 PM IST</p>
            </div>
            <div>
              <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="font-semibold">Website</p>
              <p className="text-sm">www.i2u.ai</p>
              <p className="text-xs text-muted-foreground">Bangalore, Karnataka, India</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="text-center space-y-2 pb-8">
        <p className="text-sm text-muted-foreground">
          By using i2u.ai, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Version 1.0</strong> | Production Ready | Cashfree Compliant | RBI Compliant | GoI Compliant
        </p>
        <p className="text-xs text-muted-foreground">
          Last Updated: December 16, 2025 | Next Review: June 16, 2026
        </p>
      </div>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="default" className="my-8" />
    </div>
    </PageWithSidePanels>
  );
}
