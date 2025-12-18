import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareAchievementProps {
  rank: number;
  name: string;
  country: string;
  sector: string;
  tier: string;
  isCurrentUser?: boolean;
}

export function ShareAchievement({
  rank,
  name,
  country,
  sector,
  tier,
  isCurrentUser = false,
}: ShareAchievementProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = isCurrentUser
    ? `I'm ranked #${rank} on the i2u.ai Global Leaderboard! 🚀\n\n${tier} tier • ${sector} • ${country}\n\nJoin the revolution: Ideas to Unicorns through AI!\n\n#i2uai #Startup #Entrepreneur #Leaderboard`
    : `Check out ${name} ranked #${rank} on the i2u.ai Global Leaderboard! 🚀\n\n${tier} tier • ${sector} • ${country}\n\n#i2uai #Startup`;

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://i2u.ai";

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Achievement link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          data-testid={`button-share-${rank}`}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Share Achievement</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer" data-testid="share-twitter">
          <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
          Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer" data-testid="share-linkedin">
          <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer" data-testid="share-facebook">
          <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer" data-testid="share-copy">
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
