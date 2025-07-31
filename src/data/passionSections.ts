// Enhanced TypeScript interfaces for passion cards
export interface ToolResource {
  name: string;
  url: string;
  description: string;
  pricing: "Free" | "Freemium" | "Paid";
}

export interface CardResources {
  dailyChallenge: {
    description: string;
    tool: ToolResource;
  };
  toolOfTheWeek: {
    description: string;
    tool: ToolResource;
  };
  learnMoreResources: {
    description: string;
    tool: ToolResource;
  };
}

export interface PassionCard {
  id: string;
  title: string;
  description: string;
  subheading?: string;
  questCount: number;
  toolCount: number;
  badges: string[];
  category: string;
  gradient: string;
  icon: string; // Changed from ReactNode to string
  isSpecial?: boolean;
  resources?: CardResources;
}

export interface PassionSection {
  sectionTitle: string;
  cards: PassionCard[];
}

// Enhanced passion sections data
export const passionSections: Record<string, PassionCard[]> = {
  "Professional Growth": [
    {
      id: "pg-1",
      title: "Tech Leadership & Management",
      description:
        "Lead teams, scale systems, and drive high-performance culture.",
      subheading:
        "Lead teams, scale systems, and drive high-performance culture.",
      questCount: 8,
      toolCount: 5,
      badges: ["Executive", "Advanced"],
      category: "Professional Growth",
      gradient: "from-slate-500 to-slate-700",
      icon: "Target",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Watch a 5-minute talk on leading engineering teams.",
          tool: {
            name: "LeadDev",
            url: "https://leaddev.com",
            description: "Curated leadership content for tech leads",
            pricing: "Free",
          },
        },
        toolOfTheWeek: {
          description: "Use Peoplebox for OKR and performance management",
          tool: {
            name: "Peoplebox",
            url: "https://www.peoplebox.ai",
            description:
              "OKR and performance management platform for engineering managers",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description:
            "Read The Manager's Path for engineering leadership insights",
          tool: {
            name: "The Manager's Path",
            url: "https://www.amazon.com/Managers-Path-Leaders-Navigating-Growth/dp/1491973897",
            description: "Top-rated book on engineering leadership",
            pricing: "Paid",
          },
        },
      },
    },
    {
      id: "pg-2",
      title: "Product Management for Tech",
      description: "Bridge business goals with tech execution.",
      subheading: "Bridge business goals with tech execution.",
      questCount: 10,
      toolCount: 7,
      badges: ["Strategic", "Intermediate"],
      category: "Professional Growth",
      gradient: "from-indigo-500 to-indigo-700",
      icon: "Briefcase",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Write one user story using the 'As a… I want… so that…' format.",
          tool: {
            name: "Trello",
            url: "https://trello.com",
            description: "Simple Kanban board to structure product stories",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description:
            "Use Productboard for customer-centric product management",
          tool: {
            name: "Productboard",
            url: "https://www.productboard.com",
            description: "Customer-centric product management platform",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Join Reforge for advanced product strategy programs",
          tool: {
            name: "Reforge",
            url: "https://www.reforge.com",
            description:
              "Advanced product strategy programs by industry leaders",
            pricing: "Paid",
          },
        },
      },
    },
    {
      id: "pg-3",
      title: "Building Influence in Tech Communities",
      description: "Become a known voice in your niche",
      subheading: "Become a known voice in your niche",
      questCount: 5,
      toolCount: 3,
      badges: ["Mentor", "Growth"],
      category: "Professional Growth",
      gradient: "from-gray-500 to-gray-700",
      icon: "Users",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Share a helpful insight or answer on Reddit, X, or a Discord server.",
          tool: {
            name: "TldrTech",
            url: "https://tldr.tech/",
            description: "Stay updated with bite-sized news to share",
            pricing: "Free",
          },
        },
        toolOfTheWeek: {
          description:
            "Use Typefully to write, schedule, and grow your tech presence",
          tool: {
            name: "Typefully",
            url: "https://typefully.com",
            description:
              "Write, schedule, and grow your tech presence on Twitter/X",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Build your tech presence across multiple platforms",
          tool: {
            name: "Dev.to",
            url: "https://dev.to",
            description: "Publish articles and build a following",
            pricing: "Free",
          },
        },
      },
    },
  ],
  "Startup & Tech Ideas": [
    {
      id: "st-1",
      title: "Validating Startup Ideas",
      description: "Turn vague concepts into profitable solutions.",
      subheading: "Turn vague concepts into profitable solutions.",
      questCount: 6,
      toolCount: 9,
      badges: ["Entrepreneurial", "Practical"],
      category: "Startup & Tech Ideas",
      gradient: "from-rose-400 to-rose-700",
      icon: "Rocket",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Pick one idea and list 3 problems it solves.",
          tool: {
            name: "ValidatorAI",
            url: "https://validatorai.com",
            description: "AI-powered startup idea validation tool",
            pricing: "Free",
          },
        },
        toolOfTheWeek: {
          description: "Use IdeaBuddy to structure your idea",
          tool: {
            name: "IdeaBuddy",
            url: "https://ideabuddy.com",
            description: "Business plan and idea development platform",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Check Indie Hackers for real-world founder feedback",
          tool: {
            name: "Indie Hackers",
            url: "https://www.indiehackers.com/start",
            description: "Community of founders sharing startup experiences",
            pricing: "Free",
          },
        },
      },
    },
    {
      id: "st-2",
      title: "Tech Startup Ecosystem",
      description: "Map out your support network and tools for success.",
      subheading: "Map out your support network and tools for success.",
      questCount: 7,
      toolCount: 4,
      badges: ["Business", "Advanced"],
      category: "Startup & Tech Ideas",
      gradient: "from-pink-400 to-pink-700",
      icon: "TrendingUp",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Identify 1 accelerator or community you can join today.",
          tool: {
            name: "Y Combinator Startup School",
            url: "https://www.startupschool.org",
            description: "Free courses and community for startup founders",
            pricing: "Free",
          },
        },
        toolOfTheWeek: {
          description: "Track investor outreach with FounderSuite",
          tool: {
            name: "FounderSuite",
            url: "https://foundersuite.com",
            description: "CRM platform designed specifically for startups",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description:
            "Explore Product Hunt for inspiration and early traction",
          tool: {
            name: "Product Hunt",
            url: "https://www.producthunt.com/",
            description: "Platform to discover and launch new products",
            pricing: "Free",
          },
        },
      },
    },
    {
      id: "st-3",
      title: "Pitch Deck Mastery",
      description: "Build investor-ready decks that tell a compelling story.",
      subheading: "Build investor-ready decks that tell a compelling story.",
      questCount: 3,
      toolCount: 2,
      badges: ["Pitch", "Presentation"],
      category: "Startup & Tech Ideas",
      gradient: "from-yellow-400 to-yellow-700",
      icon: "Star",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Revise your pitch deck's problem and solution slides today.",
          tool: {
            name: "Beautiful.ai",
            url: "https://www.beautiful.ai/",
            description: "AI-powered slide design platform",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description: "Get expert feedback from Pitch.com",
          tool: {
            name: "Pitch.com",
            url: "https://pitch.com/",
            description: "Collaborative, modern presentation tool",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Learn from Sequoia's Pitch Deck Template",
          tool: {
            name: "Sequoia's Pitch Deck Template",
            url: "https://www.sequoiacap.com/article/writing-a-business-plan/",
            description: "Free guide used by top founders",
            pricing: "Free",
          },
        },
      },
    },
  ],
  "Personal Productivity": [
    {
      id: "pp-1",
      title: "AI-Powered Productivity",
      description: "Leverage AI tools to 10x your personal efficiency",
      subheading:
        "Leverage AI tools to maximize focus, creativity, and output.",
      questCount: 5,
      toolCount: 15,
      badges: ["Life Changing", "Beginner"],
      category: "Personal Productivity",
      gradient: "from-emerald-400 to-emerald-700",
      icon: "Lightbulb",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Use ChatGPT to summarize your last email thread",
          tool: {
            name: "ChatGPT",
            url: "https://chat.openai.com",
            description: "AI chatbot for productivity and brainstorming",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description: "Use Notion AI to organize your tasks",
          tool: {
            name: "Notion AI",
            url: "https://notion.so",
            description:
              "AI-powered workspace for organization and collaboration",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Automate your calendar and scheduling",
          tool: {
            name: "Motion",
            url: "https://motion.app",
            description: "AI-powered calendar and scheduling assistant",
            pricing: "Paid",
          },
        },
      },
    },
    {
      id: "pp-2",
      title: "Remote Work Mastery",
      description: "Excel in distributed teams and async collaboration",
      subheading:
        "Level up remote habits with async tools and deep focus hacks.",
      questCount: 4,
      toolCount: 8,
      badges: ["Essential", "Intermediate"],
      category: "Personal Productivity",
      gradient: "from-violet-400 to-violet-700",
      icon: "Users",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Set a 25-min Pomodoro timer and disable Slack.",
          tool: {
            name: "Sunsama",
            url: "https://sunsama.com",
            description: "Task management and daily planning tool",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description: "Try Sunsama to structure your remote workday.",
          tool: {
            name: "Krisp.ai",
            url: "https://krisp.ai",
            description: "Noise cancellation for calls and meetings",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Find an accountability partner for focused work",
          tool: {
            name: "Focusmate",
            url: "https://focusmate.com",
            description: "Virtual coworking and accountability partner",
            pricing: "Freemium",
          },
        },
      },
    },
    {
      id: "pp-3",
      title: "Focus & Deep Work",
      description: "Master deep work and focus techniques for productivity",
      subheading: "Build unbreakable focus with proven deep work strategies.",
      questCount: 2,
      toolCount: 4,
      badges: ["Focus", "Discipline"],
      category: "Personal Productivity",
      gradient: "from-blue-400 to-blue-700",
      icon: "Clock",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Listen to focus music for 25 minutes without interruption.",
          tool: {
            name: "Brain.fm",
            url: "https://brain.fm",
            description: "Focus music and soundscapes for productivity",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description: "Block distracting websites and apps for focused work.",
          tool: {
            name: "Freedom",
            url: "https://freedom.to",
            description: "Website and app blocker for focused work",
            pricing: "Paid",
          },
        },
        learnMoreResources: {
          description: "Install a distraction blocker for deep focus",
          tool: {
            name: "Cold Turkey",
            url: "https://getcoldturkey.com",
            description: "Website and app blocker for deep focus",
            pricing: "Paid",
          },
        },
      },
    },
  ],
  "Solo Founder Stack": [
    {
      id: "sf-1",
      title: "Bootstrapping Essentials",
      description: "Build and launch your startup with minimal resources",
      subheading: "Build and launch your startup with minimal resources",
      questCount: 4,
      toolCount: 6,
      badges: ["Bootstrap", "Beginner"],
      category: "Solo Founder Stack",
      gradient: "from-green-400 to-green-700",
      icon: "Rocket",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Embrace MVP over perfection - ship something today.",
          tool: {
            name: "Tally",
            url: "https://tally.so",
            description: "Free form builder for collecting user feedback",
            pricing: "Free",
          },
        },
        toolOfTheWeek: {
          description: "Use Tally to create customer feedback forms",
          tool: {
            name: "Tally",
            url: "https://tally.so",
            description: "Free form builder for collecting user feedback",
            pricing: "Free",
          },
        },
        learnMoreResources: {
          description: "Learn from other bootstrapped founders",
          tool: {
            name: "Indie Hackers",
            url: "https://indiehackers.com",
            description: "Community of bootstrapped founders sharing stories",
            pricing: "Free",
          },
        },
      },
    },
    {
      id: "sf-2",
      title: "Time & Energy Management",
      description: "Maximize productivity and maintain sustainable work habits",
      subheading: "Maximize productivity and maintain sustainable work habits",
      questCount: 3,
      toolCount: 5,
      badges: ["Productivity", "Intermediate"],
      category: "Solo Founder Stack",
      gradient: "from-purple-400 to-purple-700",
      icon: "Clock",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description:
            "Use time-blocking with breaks - schedule 25-min focused sessions.",
          tool: {
            name: "Motion",
            url: "https://motion.app",
            description: "AI-powered calendar and scheduling assistant",
            pricing: "Paid",
          },
        },
        toolOfTheWeek: {
          description: "Try Motion for AI-powered scheduling",
          tool: {
            name: "Motion",
            url: "https://motion.app",
            description: "AI-powered calendar and scheduling assistant",
            pricing: "Paid",
          },
        },
        learnMoreResources: {
          description: "Read Deep Work by Cal Newport for focus strategies",
          tool: {
            name: "Deep Work by Cal Newport",
            url: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692",
            description: "Book on focused work and productivity",
            pricing: "Paid",
          },
        },
      },
    },
    {
      id: "sf-3",
      title: "Customer Discovery & Validation",
      description: "Find and validate your target market effectively",
      subheading: "Find and validate your target market effectively",
      questCount: 5,
      toolCount: 8,
      badges: ["Validation", "Advanced"],
      category: "Solo Founder Stack",
      gradient: "from-blue-400 to-blue-700",
      icon: "Users",
      isSpecial: true,
      resources: {
        dailyChallenge: {
          description: "Talk to 3 potential users this week.",
          tool: {
            name: "Typeform",
            url: "https://typeform.com",
            description: "Interactive forms and surveys for user research",
            pricing: "Freemium",
          },
        },
        toolOfTheWeek: {
          description: "Create user research surveys with Typeform",
          tool: {
            name: "Typeform",
            url: "https://typeform.com",
            description: "Interactive forms and surveys for user research",
            pricing: "Freemium",
          },
        },
        learnMoreResources: {
          description: "Read The Mom Test for customer interview techniques",
          tool: {
            name: "The Mom Test",
            url: "https://www.amazon.com/Mom-Test-customers-business-everyone/dp/1492180742",
            description: "Book on customer development and validation",
            pricing: "Paid",
          },
        },
      },
    },
  ],
};
