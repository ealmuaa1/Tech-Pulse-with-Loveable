# Passion Sections Data Management Guide

## Overview

The `passionSections.ts` file contains all the data for the Explore page cards, organized by sections. This guide shows you how to add, edit, or modify sections and cards dynamically.

## Data Structure

### Main Structure

```typescript
export const passionSections: Record<string, PassionCard[]> = {
  "Section Title": [
    // Array of cards
  ],
  // More sections...
};
```

### Card Structure

```typescript
interface PassionCard {
  id: string; // Unique identifier (e.g., "pg-1", "st-4")
  title: string; // Card title
  description: string; // Main description
  subheading?: string; // Optional subheading
  questCount: number; // Number of quests
  toolCount: number; // Number of tools
  badges: string[]; // Array of badge labels
  category: string; // Section category
  gradient: string; // Tailwind gradient classes
  icon: ReactNode; // Lucide React icon
  isSpecial?: boolean; // Flag for special rendering (collapsible resources)
  resources?: CardResources; // Optional resources data
}
```

### Resources Structure (for special cards)

```typescript
interface CardResources {
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

interface ToolResource {
  name: string; // Tool name
  url: string; // Tool URL
  description: string; // Tool description
  pricing: "Free" | "Freemium" | "Paid";
}
```

## How to Add a New Section

### 1. Add a New Section

```typescript
export const passionSections: Record<string, PassionCard[]> = {
  // ... existing sections ...

  "New Section Name": [
    // Add your cards here
  ],
};
```

### 2. Example: Adding a "Creative Skills" Section

```typescript
"Creative Skills": [
  {
    id: "cs-1",
    title: "Digital Art & Design",
    description: "Master digital art tools and design principles",
    questCount: 4,
    toolCount: 6,
    badges: ["Creative", "Beginner"],
    category: "Creative Skills",
    gradient: "from-pink-400 to-pink-700",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    id: "cs-2",
    title: "Video Editing Mastery",
    description: "Create professional videos with modern tools",
    questCount: 5,
    toolCount: 8,
    badges: ["Video", "Intermediate"],
    category: "Creative Skills",
    gradient: "from-purple-400 to-purple-700",
    icon: <Video className="w-6 h-6" />,
    isSpecial: true,
    resources: {
      dailyChallenge: {
        description: "Edit a 30-second video clip using basic transitions",
        tool: {
          name: "CapCut",
          url: "https://capcut.com",
          description: "Free video editing app with professional features",
          pricing: "Free"
        }
      },
      toolOfTheWeek: {
        description: "Try DaVinci Resolve for advanced color grading",
        tool: {
          name: "DaVinci Resolve",
          url: "https://blackmagicdesign.com/davinciresolve",
          description: "Professional video editing and color grading software",
          pricing: "Freemium"
        }
      },
      learnMoreResources: {
        description: "Learn video editing fundamentals and techniques",
        tool: {
          name: "Skillshare",
          url: "https://skillshare.com",
          description: "Online learning platform for creative skills",
          pricing: "Paid"
        }
      }
    }
  },
],
```

## How to Add a New Card to Existing Section

### 1. Add to "Professional Growth" Section

```typescript
"Professional Growth": [
  // ... existing cards ...
  {
    id: "pg-4",  // Use next available ID
    title: "Data Science Fundamentals",
    description: "Learn data analysis and machine learning basics",
    questCount: 7,
    toolCount: 5,
    badges: ["Data", "Intermediate"],
    category: "Professional Growth",
    gradient: "from-green-400 to-green-700",
    icon: <BarChart3 className="w-6 h-6" />,
  },
],
```

### 2. Add to "Startup & Tech Ideas" Section

```typescript
"Startup & Tech Ideas": [
  // ... existing cards ...
  {
    id: "st-6",  // Use next available ID
    title: "No-Code Development",
    description: "Build apps and websites without coding",
    questCount: 4,
    toolCount: 12,
    badges: ["No-Code", "Beginner"],
    category: "Startup & Tech Ideas",
    gradient: "from-teal-400 to-teal-700",
    icon: <Code className="w-6 h-6" />,
    isSpecial: true,
    resources: {
      dailyChallenge: {
        description: "Build a simple landing page using a no-code tool",
        tool: {
          name: "Webflow",
          url: "https://webflow.com",
          description: "Visual web design and development platform",
          pricing: "Freemium"
        }
      },
      toolOfTheWeek: {
        description: "Create an app prototype with Bubble",
        tool: {
          name: "Bubble",
          url: "https://bubble.io",
          description: "No-code platform for building web applications",
          pricing: "Freemium"
        }
      },
      learnMoreResources: {
        description: "Explore the no-code ecosystem and tools",
        tool: {
          name: "NoCode List",
          url: "https://nocodelist.co",
          description: "Directory of no-code tools and resources",
          pricing: "Free"
        }
      }
    }
  },
],
```

## How to Edit Existing Cards

### 1. Update Card Information

```typescript
// Find the card by ID and update properties
{
  id: "pp-1",
  title: "AI-Powered Productivity",  // Change title
  description: "New description here",  // Change description
  questCount: 6,  // Update quest count
  toolCount: 18,  // Update tool count
  badges: ["Life Changing", "Advanced"],  // Update badges
  // ... rest of properties
}
```

### 2. Update Resources

```typescript
resources: {
  dailyChallenge: {
    description: "New challenge description",
    tool: {
      name: "New Tool Name",
      url: "https://newtool.com",
      description: "New tool description",
      pricing: "Free"  // or "Freemium" or "Paid"
    }
  },
  // Update other resources similarly
}
```

## Available Icons

Import icons from `lucide-react`:

```typescript
import {
  Target,
  Briefcase,
  Users,
  Rocket,
  TrendingUp,
  Star,
  Lightbulb,
  Brain,
  Clock,
  Palette,
  Video,
  BarChart3,
  Code,
  Zap,
  BookOpen,
  Heart,
  Eye, // ... and many more
} from "lucide-react";
```

## Gradient Options

Use Tailwind gradient classes:

```typescript
// Color gradients
"from-red-400 to-red-700";
"from-orange-400 to-orange-700";
"from-yellow-400 to-yellow-700";
"from-green-400 to-green-700";
"from-blue-400 to-blue-700";
"from-indigo-400 to-indigo-700";
"from-purple-400 to-purple-700";
"from-pink-400 to-pink-700";
"from-gray-400 to-gray-700";
"from-slate-400 to-slate-700";
"from-cyan-400 to-cyan-700";
"from-teal-400 to-teal-700";
"from-emerald-400 to-emerald-700";
"from-violet-400 to-violet-700";
```

## ID Naming Convention

- **Professional Growth**: `pg-1`, `pg-2`, `pg-3`, ...
- **Startup & Tech Ideas**: `st-1`, `st-2`, `st-3`, ...
- **Personal Productivity**: `pp-1`, `pp-2`, `pp-3`, ...
- **Creative Skills**: `cs-1`, `cs-2`, `cs-3`, ...
- **New Section**: Use appropriate prefix (e.g., `ds-1` for Data Science)

## Special Cards vs Regular Cards

- **Regular Cards**: Basic cards without collapsible resources
- **Special Cards**: Set `isSpecial: true` to enable collapsible resources section

## Best Practices

1. **Unique IDs**: Always use unique IDs across all sections
2. **Consistent Structure**: Follow the same structure for all cards
3. **Descriptive Content**: Use clear, engaging descriptions
4. **Valid URLs**: Ensure all tool URLs are valid and accessible
5. **Appropriate Pricing**: Use accurate pricing information
6. **Relevant Badges**: Choose badges that reflect the card content

## Testing Changes

After making changes:

1. Save the file
2. Check the Explore page in your browser
3. Verify that new sections/cards appear correctly
4. Test collapsible resources functionality
5. Ensure all links work properly

## Common Issues

- **Missing Icon Import**: Add new icons to the import statement
- **Invalid Gradient**: Use valid Tailwind gradient classes
- **Duplicate IDs**: Ensure all card IDs are unique
- **Broken Links**: Test all tool URLs before adding
