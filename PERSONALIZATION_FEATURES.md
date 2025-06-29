# Personalization Features Documentation

## Overview

This document outlines the personalization features implemented in the Learn and Explore pages, which dynamically filter and prioritize content based on user preferences stored in Supabase.

## Features Implemented

### 1. User Context (`src/contexts/UserContext.tsx`)

- **Global State Management**: Centralized user authentication and preferences
- **Real-time Updates**: Automatic content refresh triggers when preferences change
- **Offline Handling**: Network status monitoring with retry functionality
- **Supabase Integration**: Direct database operations with error handling
- **Content Refresh System**: Global `contentRefreshKey` that triggers re-fetching across all components

### 2. User Preferences Service (`src/lib/userPreferencesService.ts`)

- **Caching**: 5-minute cache to avoid repeated API calls (legacy support)
- **Fallback**: Graceful handling for non-authenticated users
- **Utilities**: Functions for sorting, filtering, and matching topics
- **Cache Management**: Automatic cache clearing when preferences are updated

### 3. Learn Page Personalization

- **Dynamic Topic Cards**: Cards are sorted by user preferences (preferred topics first)
- **Personalized Badges**: "✨ Personalized" badge appears on matching topics
- **Fallback Behavior**: Shows trending topics when user has no preferences
- **Maintained Features**: All existing functionality preserved (AI Toolkits, navigation, design)

### 4. Explore Page Personalization

- **Passion Sections**: Cards within each section prioritized by user preferences
- **Recommended Section**: Personalized ordering based on user interests
- **Recently Viewed**: Prioritized by preference matching
- **Personalized Badges**: Visual indicators on all relevant cards
- **Maintained Features**: All existing sections and functionality preserved

### 5. Profile Page Integration

- **UserContext Integration**: Uses global state for preference management
- **Real-time Updates**: Changes trigger immediate content refresh across all pages
- **Offline Support**: Shows offline indicator with retry functionality
- **Error Handling**: Comprehensive error messages and fallback behavior
- **Preserved UI**: All existing profile features maintained

## User Experience

### For Users with Preferences:

1. Topic cards matching their interests appear first
2. Subtle "✨ Personalized" badges highlight relevant content
3. All sections (passion cards, recommendations, recently viewed) are intelligently sorted
4. Learning paths are tailored to their selected interests

### For Users without Preferences:

1. Default trending topics are shown
2. Standard ordering without personalization
3. No personalized badges appear
4. Encouragement to set preferences in Profile page

## Technical Implementation

### Global State Management:

The system uses a centralized UserContext that:

- Manages user authentication state
- Stores and updates user preferences in real-time
- Provides a `contentRefreshKey` that increments when preferences change
- Triggers automatic re-fetching across all components that consume user data
- Handles offline/online states with retry mechanisms
- Provides comprehensive error handling and fallback behavior

### Available User Interests:

- AI
- Blockchain
- Cybersecurity
- IoT
- Quantum Computing

### Matching Logic:

- Case-insensitive matching
- Partial string matching (e.g., "AI" matches "Artificial Intelligence")
- Category and title matching

### Performance Optimizations:

- 5-minute preference caching
- Efficient sorting algorithms
- Minimal API calls
- Graceful error handling

## Integration Points

### Components Updated:

- `App.tsx` - Added UserProvider wrapper for global state
- `TopicCard.tsx` - Added `isPersonalized` prop and badge
- `Learn.tsx` - Integrated UserContext and content refresh triggers
- `ExplorePage.tsx` - Full personalization with reactive updates
- `Profile.tsx` - UserContext integration with offline support

### Services:

- `UserContext.tsx` - Global state management and content refresh system
- `userPreferencesService.ts` - Core personalization logic (legacy support)
- `trendingTopicsService.ts` - Enhanced with personalization support

## Benefits

1. **Improved Relevance**: Users see content most relevant to their interests first
2. **Better Engagement**: Personalized content increases user interaction
3. **Clear Visual Feedback**: Badges help users understand why content was prioritized
4. **Preserved Functionality**: All existing features continue to work
5. **Scalable Design**: Easy to extend with additional preference types

## Future Enhancements

- Machine learning-based preference inference
- Behavioral tracking for automatic preference updates
- Advanced filtering options
- Preference-based quest recommendations
- Analytics on personalization effectiveness
