import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface EmailPopupProps {
  className?: string;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem("emailPopupSeen");

    if (!hasSeenPopup) {
      // Show immediately on first visit
      setIsOpen(true);
    } else {
      // Show after 10 seconds for returning visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("emailPopupSeen", "true");
  };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email subscription
  const handleSubscribe = async (email: string) => {
    try {
      // Validate email format
      if (!isValidEmail(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return { success: false, error: "Invalid email format" };
      }

      // Check if email already exists via REST with proper headers to avoid 406
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const checkUrl = `${supabaseUrl}/rest/v1/email_subscribers?email=eq.${encodeURIComponent(
        email
      )}`;

      const checkRes = await fetch(checkUrl, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Accept: "application/json",
        },
      });

      if (!checkRes.ok) {
        console.error(
          "Error checking existing subscriber:",
          checkRes.status,
          await checkRes.text()
        );
        throw new Error(`Failed to check subscriber: ${checkRes.status}`);
      }

      const existingList: Array<{ email: string }> = await checkRes.json();

      if (Array.isArray(existingList) && existingList.length > 0) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter.",
          variant: "default",
        });
        return { success: false, error: "Email already subscribed" };
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("email_subscribers")
        .insert([{ email }]);

      if (insertError) {
        console.error("Error inserting subscriber:", insertError);
        throw insertError;
      }

      // Success
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive weekly tech trends updates soon.",
        variant: "default",
      });

      return { success: true };
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: "Database error" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await handleSubscribe(email);

      if (result.success) {
        setHasSubmitted(true);
        localStorage.setItem("emailPopupSeen", "true");

        // Close popup after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-8 text-white">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white/80 transition-all hover:bg-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader className="text-center space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="text-4xl animate-bounce">🔔</div>
            </div>

            <DialogTitle className="text-2xl font-bold text-white leading-tight">
              🔔 Don't Miss the Future
            </DialogTitle>

            <DialogDescription className="text-white/90 text-base leading-relaxed">
              Sign up for weekly updates so you never miss the newest AI tools,
              tech trends, and breakthrough apps shaping the future.
            </DialogDescription>
          </DialogHeader>

          {/* Form Section */}
          <div className="mt-6">
            {!hasSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 text-base transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="text-3xl animate-bounce">🎉</div>
                <div className="text-white text-xl font-semibold">
                  Welcome to the Future!
                </div>
                <p className="text-white/90">
                  You'll receive your first tech trends update soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPopup;
