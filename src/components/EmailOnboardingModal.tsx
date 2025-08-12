import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

type SubscriberPrefs = {
  interests?: string; // comma-separated
  primary_goal?: string;
  update_frequency?: string;
  usage_type?: string;
  experience_level?: string; // optional
  challenge?: string;
  updated_at?: string;
};

const INTEREST_OPTIONS = [
  "AI tools",
  "Cybersecurity",
  "Blockchain",
  "Cloud/DevOps",
  "Web3",
  "Mobile",
  "AR/VR",
];

const GOAL_OPTIONS = [
  "Stay updated",
  "Learn new skills",
  "Improve business",
  "Career growth",
];

const FREQ_OPTIONS = ["Weekly", "Daily", "Monthly"];
const USAGE_OPTIONS = ["Personal", "Business", "Both"];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const EmailOnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Step 2 state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [updateFrequency, setUpdateFrequency] = useState<string>("Weekly");
  const [usageType, setUsageType] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [challenge, setChallenge] = useState<string>("");

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const hasCompleted = useMemo(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("tp_onboard_done") === "1",
    []
  );

  // Trigger: show after 8s OR when user scrolls 40%
  useEffect(() => {
    if (hasCompleted) return;

    let opened = false;
    const timer = window.setTimeout(() => {
      if (!opened) {
        opened = true;
        setIsOpen(true);
      }
    }, 8000);

    const onScroll = () => {
      if (opened) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = scrollTop / docHeight;
      if (progress >= 0.4) {
        opened = true;
        setIsOpen(true);
        window.clearTimeout(timer);
        window.removeEventListener("scroll", onScroll, {
          passive: true,
        } as any);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true } as any);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll as any);
    };
  }, [hasCompleted]);

  // Focus management and Esc to close
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      if (emailInputRef.current && step === 1) {
        emailInputRef.current.focus();
      } else if (modalRef.current) {
        const first = modalRef.current.querySelector<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        first?.focus();
      }
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!modalRef.current.contains(document.activeElement)) {
          first.focus();
          e.preventDefault();
        } else {
          if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step]);

  const isValidEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setInlineError(null);

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("email_subscribers")
        .upsert({ email: trimmed })
        .select();

      if (error) {
        // Continue to step 2 if conflict-like situations occur; upsert should handle it anyway
        console.error("Email upsert error:", error);
        toast({
          title: "Subscription Error",
          description:
            "We had trouble saving your email. You can still continue.",
          variant: "destructive",
        });
      }

      console.info("onboarding:email_captured");
      setStep(2);
    } catch (err) {
      console.error("Email submit exception:", err);
      toast({
        title: "Subscription Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (isSubmitting) return;
    setInlineError(null);
    if (!isValidEmail(email)) {
      setInlineError(
        "Email missing or invalid. Please go back and correct it."
      );
      return;
    }

    const prefs: SubscriberPrefs = {
      interests: selectedInterests.join(", "),
      primary_goal: primaryGoal || null || undefined,
      update_frequency: updateFrequency || null || undefined,
      usage_type: usageType || null || undefined,
      experience_level: experienceLevel || undefined,
      challenge: challenge || undefined,
      updated_at: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("email_subscribers")
        .update(prefs)
        .eq("email", email.trim());

      if (error) {
        console.error("Preferences update error:", error);
        setInlineError("Failed to save preferences. Please try again.");
        return;
      }

      console.info("onboarding:preferences_saved");
      toast({
        title: "You’re in!",
        description: "We’ll tailor updates to your interests.",
        variant: "default",
      });
      localStorage.setItem("tp_onboard_done", "1");
      setIsOpen(false);
    } catch (err) {
      console.error("Finish exception:", err);
      setInlineError("Unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || hasCompleted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      aria-modal="true"
      role="dialog"
      aria-labelledby="onboard-title"
      aria-describedby="onboard-desc"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden"
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-4 text-sm text-gray-500">
            {step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
          </div>
          <h2 id="onboard-title" className="text-2xl font-bold tracking-tight">
            🔔 Don’t Miss the Future
          </h2>
          <p id="onboard-desc" className="mt-1 text-gray-600">
            {step === 1
              ? "Get weekly AI tools, tech trends, and startup ideas."
              : "Answer a few quick questions so we can tailor updates to you."}
          </p>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="onboard-email" className="sr-only">
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="onboard-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className={classNames(
                  "inline-flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold text-white transition-transform",
                  "bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Saving..." : "Subscribe"}
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Q1: Interests (multi-select pills) */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Which tech areas interest you most?
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((opt) => {
                    const active = selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleToggleInterest(opt)}
                        className={classNames(
                          "rounded-full px-3 py-1 text-sm border transition",
                          active
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Q2: Primary goal (single select) */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Your primary goal?
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPrimaryGoal(opt)}
                      className={classNames(
                        "rounded-lg px-3 py-2 text-sm border text-left transition",
                        primaryGoal === opt
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Update frequency */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  How often should we email you updates?
                </div>
                <div className="mt-3 flex gap-2">
                  {FREQ_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setUpdateFrequency(opt)}
                      className={classNames(
                        "rounded-full px-3 py-1 text-sm border transition",
                        updateFrequency === opt
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Usage type */}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Do you use AI for personal or business?
                </div>
                <div className="mt-3 flex gap-2">
                  {USAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setUsageType(opt)}
                      className={classNames(
                        "rounded-full px-3 py-1 text-sm border transition",
                        usageType === opt
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Optional textarea */}
              <div>
                <label
                  htmlFor="challenge"
                  className="text-sm font-medium text-gray-900"
                >
                  What’s your #1 tech challenge right now? (optional)
                </label>
                <textarea
                  id="challenge"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Tell us briefly..."
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                />
              </div>

              {inlineError ? (
                <div className="text-sm text-red-600">{inlineError}</div>
              ) : null}

              <div className="mt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className={classNames(
                    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-white transition-transform",
                    "bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Saving..." : "Finish"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailOnboardingModal;
