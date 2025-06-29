import { ProPlaybook, PromptPack, PromptAuthor } from "@/types";

// Mock Pro Playbooks Data
export const mockPlaybooks: ProPlaybook[] = [
  {
    id: "pb_ai_dentistry",
    title: "AI-Powered Patient Communication System for Dental Practices",
    description:
      "Build an automated patient follow-up and appointment scheduling system using AI chatbots and smart forms to increase practice efficiency by 40%.",
    industry: "Healthcare",
    role: "Dental Practice Owner",
    difficulty: "Intermediate",
    price: 49,
    isPremium: true,
    estimated_roi: "$2,500/month",
    time_to_implement: "2-3 weeks",
    use_cases: [
      "Automated appointment reminders",
      "Post-treatment follow-ups",
      "Insurance verification",
      "New patient onboarding",
    ],
    preview_available: true,
    steps: [
      {
        id: "step_1",
        title: "Set up ChatGPT API for patient communication",
        description:
          "Configure OpenAI API with HIPAA-compliant prompts for dental practice communication",
        tools_needed: ["OpenAI API", "Zapier", "Practice Management Software"],
        prompts: [
          "You are a dental assistant AI. Help patients with appointment scheduling while maintaining HIPAA compliance. Always be professional and empathetic.",
          "Generate a friendly appointment reminder message for [PATIENT_NAME] for their [APPOINTMENT_TYPE] on [DATE] at [TIME].",
        ],
        expected_output:
          "Automated chatbot responses for common patient inquiries",
        difficulty_level: 3,
      },
      {
        id: "step_2",
        title: "Create Zapier automation workflows",
        description:
          "Build automated workflows connecting your practice management system to communication channels",
        tools_needed: ["Zapier", "Google Calendar", "SMS Service"],
        prompts: [
          "Create a workflow trigger when a new appointment is scheduled in [PRACTICE_SOFTWARE]",
          "Generate follow-up survey questions for post-treatment patient feedback",
        ],
        expected_output: "Fully automated patient communication pipeline",
        difficulty_level: 4,
      },
    ],
    tools: [
      {
        name: "OpenAI GPT-4",
        type: "AI",
        pricing: "$20/month",
        integration_complexity: "Easy",
        alternatives: ["Claude", "Bard"],
      },
      {
        name: "Zapier",
        type: "Automation",
        pricing: "$29/month",
        integration_complexity: "Medium",
        alternatives: ["Make", "Microsoft Power Automate"],
      },
    ],
    templates: [
      {
        name: "Patient Communication Prompts Library",
        format: "Notion",
        downloadable: true,
        premium_only: true,
      },
      {
        name: "Zapier Workflow Templates",
        format: "PDF",
        downloadable: true,
        premium_only: false,
      },
    ],
  },
  {
    id: "pb_marketing_seo",
    title: "AI-Driven SEO Content Cluster Generator for Marketing Agencies",
    description:
      "Create comprehensive SEO content strategies using AI tools and data APIs to deliver $5,000+ value to clients in under 4 hours.",
    industry: "Marketing",
    role: "Marketing Agency Owner",
    difficulty: "Advanced",
    price: 79,
    isPremium: true,
    estimated_roi: "$5,000-15,000/client",
    time_to_implement: "1-2 weeks",
    use_cases: [
      "Generate 100+ SEO-optimized articles",
      "Keyword research automation",
      "Competitor content analysis",
      "Content calendar planning",
    ],
    preview_available: true,
    steps: [
      {
        id: "step_1",
        title: "Set up DataForSEO API integration",
        description:
          "Connect to DataForSEO for keyword research and competitor analysis",
        tools_needed: ["DataForSEO API", "Google Sheets", "Python/Zapier"],
        prompts: [
          "Analyze the top 10 ranking pages for [TARGET_KEYWORD] and identify content gaps",
          "Generate a list of 50 related keywords with search volume and difficulty scores",
        ],
        expected_output: "Comprehensive keyword research dataset",
        difficulty_level: 5,
      },
    ],
    tools: [
      {
        name: "DataForSEO",
        type: "Analytics",
        pricing: "$100/month",
        integration_complexity: "Complex",
        alternatives: ["SEMrush API", "Ahrefs API"],
      },
    ],
    templates: [
      {
        name: "SEO Content Strategy Template",
        format: "Airtable",
        downloadable: true,
        premium_only: true,
      },
    ],
  },
  {
    id: "pb_freelancer_leadgen",
    title: "Automated Lead Generation System for Freelance Consultants",
    description:
      "Build a $500/month recurring lead generation service using AI-powered outreach and LinkedIn automation.",
    industry: "Consulting",
    role: "Freelance Consultant",
    difficulty: "Beginner",
    price: 29,
    isPremium: true,
    estimated_roi: "$500-2000/month",
    time_to_implement: "1 week",
    use_cases: [
      "LinkedIn outreach automation",
      "Cold email sequences",
      "Lead scoring and qualification",
      "Follow-up automation",
    ],
    preview_available: true,
    steps: [
      {
        id: "step_1",
        title: "LinkedIn outreach automation setup",
        description:
          "Configure AI-powered LinkedIn messaging with personalization",
        tools_needed: ["LinkedIn Sales Navigator", "Phantombuster", "ChatGPT"],
        prompts: [
          "Write a personalized LinkedIn connection request for [NAME] who works at [COMPANY] in [INDUSTRY]",
          "Create a follow-up message for someone who accepted your LinkedIn connection request",
        ],
        expected_output: "Automated LinkedIn lead generation pipeline",
        difficulty_level: 2,
      },
    ],
    tools: [
      {
        name: "Phantombuster",
        type: "Automation",
        pricing: "$69/month",
        integration_complexity: "Easy",
        alternatives: ["Meet Leonard", "Expandi"],
      },
    ],
    templates: [
      {
        name: "LinkedIn Outreach Templates",
        format: "Google_Sheets",
        downloadable: true,
        premium_only: false,
      },
    ],
  },
];

// Mock Prompt Authors
export const mockAuthors: PromptAuthor[] = [
  {
    id: "author_1",
    name: "Sarah Chen",
    title: "AI Marketing Strategist",
    bio: "Former Head of Growth at Shopify, now helping 500+ businesses scale with AI automation.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    verified: true,
    expertise_areas: ["Marketing", "Copywriting", "E-commerce"],
  },
  {
    id: "author_2",
    name: "Marcus Rodriguez",
    title: "Legal Tech Consultant",
    bio: "15+ years in legal tech. Built AI systems for top law firms saving 100+ hours/week.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    expertise_areas: ["Legal", "Document Automation", "Compliance"],
  },
  {
    id: "author_3",
    name: "Dr. Emily Watson",
    title: "Healthcare Data Scientist",
    bio: "MD + AI researcher. Created HIPAA-compliant AI tools used by 50+ hospitals.",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    verified: true,
    expertise_areas: ["Medical", "Healthcare", "Data Analysis"],
  },
];

// Mock Prompt Packs Data
export const mockPromptPacks: PromptPack[] = [
  {
    id: "pack_copywriting_master",
    title: "Master Copywriter's AI Prompt Collection",
    description:
      "50+ battle-tested prompts for high-converting sales copy, email sequences, and ad campaigns. Used by agencies billing $100K+/month.",
    category: "Copywriting",
    author: mockAuthors[0],
    price: 29,
    tier: "Pro",
    rating: 4.9,
    downloads: 1247,
    tags: ["Sales Copy", "Email Marketing", "Ad Copy", "Conversion"],
    created_at: "2024-01-15",
    updated_at: "2024-01-20",
    sample_outputs: [
      "Subject: The $47 mistake that's costing you $10K/month",
      "Your competitors are using this unfair advantage (and you're not)",
      "How [Company] increased revenue by 340% in 90 days",
    ],
    prompts: [
      {
        id: "prompt_headline",
        title: "Benefit-Driven Headlines Generator",
        prompt_text:
          "Write 10 compelling headlines for [PRODUCT/SERVICE] that focus on the main benefit of [PRIMARY_BENEFIT]. Target audience: [TARGET_AUDIENCE]. Each headline should be under 60 characters and create urgency or curiosity. Include power words like 'secret', 'proven', 'instant', 'exclusive'.",
        variables: [
          {
            name: "PRODUCT/SERVICE",
            type: "text",
            required: true,
            description: "What you're selling",
          },
          {
            name: "PRIMARY_BENEFIT",
            type: "text",
            required: true,
            description: "Main value proposition",
          },
          {
            name: "TARGET_AUDIENCE",
            type: "text",
            required: true,
            description: "Who you're targeting",
          },
        ],
        use_case: "Creating high-converting headlines for sales pages",
        expected_output_type: "List of 10 headlines",
        sample_input:
          "AI Marketing Course, Save 20 hours/week, Small business owners",
        sample_output:
          "• The Secret AI Tool Saving Business Owners 20+ Hours Weekly\n• How Smart Entrepreneurs Cut Marketing Time by 95%\n• Exclusive: The 20-Hour Marketing Week System",
      },
      {
        id: "prompt_email_sequence",
        title: "7-Day Email Sequence Creator",
        prompt_text:
          "Create a 7-day email sequence for [PRODUCT/SERVICE] targeting [TARGET_AUDIENCE]. Each email should have a compelling subject line and focus on a different aspect: Day 1: Problem awareness, Day 2: Solution introduction, Day 3: Social proof, Day 4: Objection handling, Day 5: Urgency/scarcity, Day 6: Bonuses/value stack, Day 7: Final call to action. Include [MAIN_BENEFIT] throughout.",
        variables: [
          {
            name: "PRODUCT/SERVICE",
            type: "text",
            required: true,
            description: "What you're promoting",
          },
          {
            name: "TARGET_AUDIENCE",
            type: "text",
            required: true,
            description: "Your ideal customer",
          },
          {
            name: "MAIN_BENEFIT",
            type: "text",
            required: true,
            description: "Primary value proposition",
          },
        ],
        use_case: "Building automated email funnels",
        expected_output_type: "7 complete emails with subject lines",
        sample_input:
          "AI Productivity Course, Overwhelmed entrepreneurs, Save 15 hours per week",
        sample_output:
          "Day 1 Subject: Are you drowning in busywork?\nBody: Hi [NAME], I see you're interested in getting your time back...",
      },
    ],
  },
  {
    id: "pack_legal_automation",
    title: "Legal Document Automation Prompts",
    description:
      "HIPAA & SOC2 compliant prompts for contract review, legal research, and document drafting. Trusted by 200+ law firms.",
    category: "Legal",
    author: mockAuthors[1],
    price: 49,
    tier: "Premium",
    rating: 4.8,
    downloads: 623,
    tags: ["Contracts", "Legal Research", "Compliance", "Document Review"],
    created_at: "2024-01-10",
    updated_at: "2024-01-25",
    sample_outputs: [
      "Contract Risk Assessment: Medium risk identified in Section 4.2 regarding liability limitations",
      "Legal Research Summary: 15 relevant cases found supporting client's position on intellectual property",
      "Compliance Check: Document meets SOC2 requirements with minor recommendations",
    ],
    prompts: [
      {
        id: "prompt_contract_review",
        title: "Contract Risk Analysis",
        prompt_text:
          "Review this contract section and identify potential risks: [CONTRACT_SECTION]. Focus on: 1) Liability and indemnification clauses, 2) Termination conditions, 3) Intellectual property rights, 4) Payment terms, 5) Dispute resolution. Rate each risk as Low/Medium/High and provide specific recommendations for negotiation.",
        variables: [
          {
            name: "CONTRACT_SECTION",
            type: "textarea",
            required: true,
            description: "Paste the contract section to review",
          },
        ],
        use_case: "Quick contract risk assessment",
        expected_output_type: "Risk analysis with ratings and recommendations",
        sample_input:
          "The Client agrees to indemnify and hold harmless the Service Provider...",
        sample_output:
          "Risk Analysis:\n1. Indemnification Clause - HIGH RISK\nRecommendation: Add mutual indemnification...",
      },
    ],
  },
  {
    id: "pack_medical_documentation",
    title: "HIPAA-Compliant Medical Documentation AI",
    description:
      "Streamline clinical documentation while maintaining patient privacy. 30+ prompts for medical notes, treatment plans, and patient communication.",
    category: "Medical",
    author: mockAuthors[2],
    price: 39,
    tier: "Pro",
    rating: 4.7,
    downloads: 445,
    tags: ["HIPAA", "Clinical Notes", "Patient Care", "Medical Records"],
    created_at: "2024-01-05",
    updated_at: "2024-01-22",
    sample_outputs: [
      "Clinical Assessment: Patient presents with symptoms consistent with...",
      "Treatment Plan: Recommend 6-week physical therapy protocol with...",
      "Patient Education: Simplified explanation of diagnosis and next steps",
    ],
    prompts: [
      {
        id: "prompt_clinical_notes",
        title: "Clinical Note Generator",
        prompt_text:
          "Generate a clinical note based on: Chief Complaint: [CHIEF_COMPLAINT], Assessment: [ASSESSMENT], Plan: [TREATMENT_PLAN]. Follow SOAP format and ensure HIPAA compliance by not including specific patient identifiers. Use professional medical terminology while being concise and accurate.",
        variables: [
          {
            name: "CHIEF_COMPLAINT",
            type: "text",
            required: true,
            description: "Patient's main concern",
          },
          {
            name: "ASSESSMENT",
            type: "textarea",
            required: true,
            description: "Clinical assessment",
          },
          {
            name: "TREATMENT_PLAN",
            type: "textarea",
            required: true,
            description: "Recommended treatment",
          },
        ],
        use_case: "Standardizing clinical documentation",
        expected_output_type: "SOAP format clinical note",
        sample_input:
          "Joint pain, Likely osteoarthritis based on X-ray, Physical therapy and anti-inflammatory",
        sample_output:
          "SOAP Note:\nS: Patient reports joint pain...\nO: Physical examination reveals...\nA: Consistent with osteoarthritis...\nP: Initiate physical therapy...",
      },
    ],
  },
];

// Usage tracking for premium features
export const PREMIUM_FEATURE_LIMITS = {
  Free: {
    playbooks: 0,
    prompt_packs: 3,
    briefing_builder: 0,
    ai_toolkits: 5,
  },
  Pro: {
    playbooks: 10,
    prompt_packs: 50,
    briefing_builder: 5,
    ai_toolkits: -1, // unlimited
  },
  Enterprise: {
    playbooks: -1,
    prompt_packs: -1,
    briefing_builder: -1,
    ai_toolkits: -1,
  },
};

// Pricing tiers
export const PRICING_TIERS = {
  Pro: {
    monthly: 29,
    yearly: 290, // 2 months free
    features: [
      "Unlimited AI Toolkits",
      "10 Pro Playbooks per month",
      "50 Prompt Packs",
      "5 Briefing Builders",
      "Priority Support",
      "Advanced Analytics",
    ],
  },
  Enterprise: {
    monthly: 99,
    yearly: 990,
    features: [
      "Everything in Pro",
      "Unlimited Playbooks",
      "Unlimited Prompt Packs",
      "Unlimited Briefing Builders",
      "White-label Options",
      "Custom Integrations",
      "Dedicated Success Manager",
    ],
  },
};
