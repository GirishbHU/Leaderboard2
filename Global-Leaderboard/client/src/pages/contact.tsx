import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { GlobalCounters } from "@/components/global-counters";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { 
  ArrowRight, 
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Globe,
  Clock,
  Send,
  Linkedin,
  Twitter
} from "lucide-react";

const contactMethods = [
  {
    title: "Email Us",
    description: "Get a response within 24 hours",
    value: "hello@i2u.ai",
    icon: <Mail className="h-6 w-6" />
  },
  {
    title: "Call Us",
    description: "Mon-Fri from 9am to 6pm IST",
    value: "+91 (800) 123-4567",
    icon: <Phone className="h-6 w-6" />
  },
  {
    title: "Visit Us",
    description: "Our headquarters",
    value: "Bengaluru, India",
    icon: <MapPin className="h-6 w-6" />
  },
];

const faqItems = [
  {
    question: "How long does registration take?",
    answer: "Registration takes just 2-3 minutes. Once you complete payment, you'll have immediate access to your dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking (for India), and PayPal for international payments."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade your subscription at any time from your dashboard. The price difference will be prorated."
  },
  {
    question: "Is there a refund policy?",
    answer: "We offer a 7-day money-back guarantee. If you're not satisfied, contact us within 7 days for a full refund."
  },
];

export default function Contact() {
  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-4xl px-4"
      >
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-4">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Us
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Get in</span>
          <br />
          <span className="text-primary">Touch</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
        </p>

        <DynamicPricingBanner showBenefits={false} compact={true} />
        <GlobalCounters variant="full" className="mt-4" showButton={true} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-5xl px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {method.icon}
                </div>
                <h3 className="font-bold mb-1">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                <p className="font-medium text-primary">{method.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl px-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" data-testid="input-contact-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" data-testid="input-contact-email" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your Startup" data-testid="input-contact-company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" data-testid="input-contact-subject" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  rows={5}
                  data-testid="input-contact-message"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" data-testid="button-send-message">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Quick answers to common questions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{item.question}</h3>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <Globe className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Connect With Us</h3>
            <p className="text-muted-foreground mb-6">Follow us on social media for the latest updates</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg" className="gap-2">
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Twitter className="h-5 w-5" />
                Twitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="default" className="my-8" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
            <p className="opacity-90 mb-6">
              Our support team typically responds within 2-4 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" data-testid="button-live-chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" data-testid="button-register-contact">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
