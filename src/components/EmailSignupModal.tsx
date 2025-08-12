import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { subscribeToNewsletter } from "@/services/newsletter";

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

const EmailSignupModal: React.FC = () => {
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
  const hasTriggeredRef = useRef(false);

  const hasCompleted = useMemo(() => {
    if (typeof window === "undefined") return false;
    const done =
      localStorage.getItem("tp_onboard_done") === "1" ||
      localStorage.getItem("tp_subscribed") === "1" ||
      localStorage.getItem("tp_subscribe_optout") === "1";
    console.log("onboarding:hasCompleted check", {
      done,
      tp_onboard_done: localStorage.getItem("tp_onboard_done"),
      tp_subscribed: localStorage.getItem("tp_subscribed"),
      tp_subscribe_optout: localStorage.getItem("tp_subscribe_optout"),
    });
    return done;
  }, []);

  // Debug hook to manually open from console: tpShowOnboarding()
  useEffect(() => {
    try {
      (window as any).tpShowOnboarding = () => {
        console.log("onboarding:manual_trigger");
        setIsOpen(true);
      };
      (window as any).tpClearFlags = () => {
        localStorage.removeItem("tp_onboard_done");
        localStorage.removeItem("tp_subscribed");
        localStorage.removeItem("tp_subscribe_optout");
        console.log("onboarding:flags_cleared");
        window.location.reload();
      };
      console.info("onboarding:modal_ready", { hasCompleted });
    } catch {}
  }, [hasCompleted]);

  // Trigger: show after 8s OR when user scrolls 40%
  useEffect(() => {
    if (hasCompleted || hasTriggeredRef.current) return;

    let opened = false;
    const timer = window.setTimeout(() => {
      if (!opened) {
        opened = true;
        hasTriggeredRef.current = true;
        setIsOpen(true);
        console.info("onboarding:timer_fired");
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
        hasTriggeredRef.current = true;
        setIsOpen(true);
        console.info("onboarding:scroll_triggered", { progress });
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

  // Step 1 submit: validate email and proceed to step 2
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setInlineError(null);

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setInlineError("Please enter a valid email address.");
      return;
    }

    // Email validation passed, proceed to step 2
    console.info("onboarding:email_validated", trimmed);
    setStep(2);
  };

  // Step 2 submit: use newsletter service
  const handleFinish = async () => {
    if (isSubmitting) return;
    setInlineError(null);

    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setInlineError(
        "Email missing or invalid. Please go back and correct it."
      );
      return;
    }

    // Validate required fields
    if (!primaryGoal) {
      setInlineError("Please select your primary goal.");
      return;
    }

    if (!usageType) {
      setInlineError("Please select how you use AI.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await subscribeToNewsletter({
        email: trimmed,
        interests: selectedInterests,
        primary_goal: primaryGoal,
        update_frequency: updateFrequency,
        usage_type: usageType,
        experience_level: experienceLevel,
        challenge: challenge,
      });

      if (result.ok) {
        console.info("onboarding:preferences_saved", trimmed);
        toast({
          title: "Subscription complete",
          description: "We'll tailor updates to your interests.",
          variant: "default",
        });
        localStorage.setItem(
          "tp:newsletter:dismissedAt",
          new Date().toISOString()
        );
        localStorage.setItem("tp_subscribed", "1");
        localStorage.setItem("tp_onboard_done", "1");
        setIsOpen(false);
      } else {
        console.error("Newsletter subscription failed:", result.error);
        toast({
          title: "Subscription failed",
          description: "Please try again later.",
          variant: "destructive",
        });
        // DO NOT close modal on error
      }
    } catch (err) {
      console.error("Newsletter subscription exception:", err);
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      // DO NOT close modal on error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || hasCompleted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
      aria-modal="true"
      role="dialog"
      aria-labelledby="signup-title"
      aria-describedby="signup-desc"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md sm:max-w-lg rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Step 1: keep original gradient + animation styling from EmailPopup */}
        {step === 1 ? (
          <div className="relative bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-8 text-white">
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white/80 transition-all hover:bg-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="text-sm text-white/80 mb-3">Step 1 of 2</div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="text-4xl animate-bounce">🔔</div>
              </div>
              <h2
                id="signup-title"
                className="text-2xl font-bold text-white leading-tight"
              >
                🔔 Don’t Miss the Future
              </h2>
              <p
                id="signup-desc"
                className="text-white/90 text-base leading-relaxed"
              >
                Get weekly AI tools, tech trends, and startup ideas.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div className="space-y-3">
                <label htmlFor="signup-email" className="sr-only">
                  Email
                </label>
                <input
                  ref={emailInputRef}
                  id="signup-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-lg px-4 py-3 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {inlineError ? (
                <div className="text-sm text-red-100">{inlineError}</div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className={classNames(
                  "w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 text-base transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50 rounded-lg",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </form>
          </div>
        ) : (
          // Step 2: questionnaire UI
          <div className="bg-white p-6 sm:p-8">
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-gray-500">Step 2 of 2</div>
              <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-indigo-500"></div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">
              Tell us what you like
            </h3>
            <p className="mt-1 text-gray-600">
              Answer a few quick questions so we can tailor updates to you.
            </p>

            <div className="mt-6 space-y-6">
              {/* Q1: Interests */}
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

              {/* Q2: Primary goal */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSignupModal;
