# Profile Preferences Testing Guide

This guide helps you verify that profile preferences save correctly and the Learn page loads dynamic topics based on user preferences.

## ✅ What Should Work

### 1. Profile Save Behavior

- When you click "Save Interests" in Profile, it should:
  - Show animation with spinner ("Saving...")
  - Turn green with checkmark ("Saved!")
  - Update Supabase `profiles.favorite_topics` field as `text[]` array
  - Show success toast notification

### 2. Learn Page Dynamic Loading

- When the Learn page loads:
  - Fetches user's `favorite_topics` from Supabase via UserContext
  - Filters trending topics based on user preferences
  - Shows "✨ Personalized" badges on matching topics
  - Displays fallback message if no preferences or no matching content

## 🧪 How to Test

### Step 1: Open the Application

```bash
npm run dev
```

Navigate to http://localhost:5173

### Step 2: Sign Up/Login

1. Go to `/login` or click "Sign In"
2. Create account or use existing credentials
3. Verify you're logged in (see user menu/profile)

### Step 3: Test Profile Preferences

1. Navigate to `/profile`
2. You should see a **Debug Panel** in the bottom right corner
3. In the "Favorite Topics" section:
   - Select some topics (e.g., "AI", "Blockchain", "Cybersecurity")
   - Click "Save Preferences"
   - Watch for:
     - Button shows spinner → green checkmark
     - Success toast appears
     - Debug panel shows updated data

### Step 4: Verify Database Storage

1. In the Debug Panel, click "Fetch Direct DB"
2. Check that:
   - **Type:** shows "array" (not "string")
   - **Value:** shows your selected topics as JSON array
   - All three sections (UserContext, Profile, Direct DB) match

### Step 5: Test Learn Page Personalization

1. Navigate to `/learn`
2. Debug panel should show your preferences
3. Look for:
   - Topics with "✨ Personalized" badges matching your interests
   - Blue info box showing "Showing content for your interests: [your topics]"
   - Content filtered/prioritized based on your preferences

### Step 6: Test Cross-Page Updates

1. Go back to `/profile`
2. Change your topic preferences
3. Click "Save Preferences"
4. Return to `/learn`
5. Verify content updates automatically (reactive)

## 🔍 Debug Information

The temporary debug panel shows:

- **User ID**: Current authenticated user
- **UserContext Preferences**: Topics from app state
- **Profile Data**: Topics from profile state
- **Direct DB Data**: Raw data from Supabase

All three should match after saving preferences.

## 🐛 Common Issues & Solutions

### Issue: "No preferences set" despite selecting topics

**Solution**: Check browser console for errors. Verify Supabase connection.

### Issue: Preferences don't save

**Solution**:

1. Check if user is authenticated
2. Verify Supabase credentials in `.env`
3. Check browser network tab for failed requests

### Issue: Learn page doesn't update

**Solution**:

1. Verify UserContext is properly loading preferences
2. Check if `contentRefreshKey` is updating
3. Look for filtering logic in console logs

### Issue: Database shows string instead of array

**Solution**: Run the migration:

```sql
-- Check current type
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'favorite_topics';

-- Should show: text[]
```

## 📊 Expected Data Flow

```
Profile Page (Select Topics)
  ↓ (Click Save)
UserContext.updatePreferences(topics)
  ↓
userPreferencesService.updateUserPreferences(topics)
  ↓
Supabase: UPDATE profiles SET favorite_topics = $1 WHERE id = $2
  ↓
UserContext refreshes → triggers contentRefreshKey update
  ↓
Learn Page detects change → re-filters content → shows personalized badges
```

## 🎯 Success Criteria

✅ **Profile Save**:

- Smooth animation on save button
- Success toast notification
- Database updated with array format
- All debug sections show same data

✅ **Learn Page Personalization**:

- Personalized badges on relevant topics
- Content filtered by user interests
- Real-time updates when preferences change
- Fallback messages when appropriate

## 🚀 Production Deployment

Before deploying:

1. **Remove Debug Component**:

```typescript
// Remove from Learn.tsx
import DebugPreferences from "@/components/DebugPreferences";
// Remove from JSX
<DebugPreferences />;
```

2. **Delete Debug Files**:

```bash
rm src/components/DebugPreferences.tsx
rm PROFILE_TESTING_GUIDE.md
```

3. **Verify Environment Variables**:

```bash
# Required for Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔗 Key Files

- **Profile Page**: `src/pages/Profile.tsx`
- **Learn Page**: `src/pages/Learn.tsx`
- **User Context**: `src/contexts/UserContext.tsx`
- **Preferences Service**: `src/lib/userPreferencesService.ts`
- **Topic Card**: `src/components/TopicCard.tsx`
- **Database Migration**: `supabase/migrations/20240101000007_update_favorite_topics_to_array.sql`
