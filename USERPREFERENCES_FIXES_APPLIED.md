# UserPreferencesService.ts - Robust Fixes Applied ✅

## 🎯 Bugs Fixed

1. ✅ **Avoid querying non-existent columns** - Added schema detection before queries
2. ✅ **Graceful handling of missing data** - Always returns `{ favorite_topics: [] }`
3. ✅ **Correct table targeting** - Dynamically chooses `profiles.favorite_topics` or `preferences.favorite_topics`
4. ✅ **Comprehensive error logging** - All Supabase errors logged with details

## 🔧 Key Features Implemented

### Schema Detection System

- ✅ **Dynamic schema checking** - Detects which tables/columns exist before querying
- ✅ **Schema caching** - Caches schema info for 30 minutes to avoid repeated checks
- ✅ **Error code handling** - Properly handles `42P01` (table missing) and `42703` (column missing)

### Robust Data Fetching (`getUserPreferences`)

```typescript
// Always returns safe structure
{
  favorite_topics: [];
} // Even on errors

// Schema-aware querying
if (schema.preferencesTableExists) {
  // Try preferences table first
} else if (schema.profilesHasFavoriteTopics) {
  // Fallback to profiles table
}
```

### Smart Update Logic (`updateUserPreferences`)

```typescript
// Targets correct table based on what exists
if (schema.preferencesTableExists) {
  // Update preferences table
} else if (schema.profilesHasFavoriteTopics) {
  // Update profiles table
} else {
  // Error: No suitable table found
}
```

### Comprehensive Error Logging

- ✅ **Detailed error objects** - Logs code, message, details, hint
- ✅ **Specific error types** - 23503, 42501, 23505, PGRST116, 42P01, 42703
- ✅ **Exception handling** - Catches and logs all exceptions
- ✅ **Schema validation** - Warns when no suitable storage exists

## 🧪 How It Works

### 1. Schema Detection

```typescript
const checkDatabaseSchema = async () => {
  // Test preferences table existence
  const { error } = await supabase
    .from("preferences")
    .select("user_id")
    .limit(1);

  // Test profiles.favorite_topics column existence
  const { error } = await supabase
    .from("profiles")
    .select("favorite_topics")
    .limit(1);
};
```

### 2. Safe Data Fetching

```typescript
// Try preferences table first
if (schema.preferencesTableExists) {
  // Query preferences table
}

// Fallback to profiles table
if (!querySuccessful && schema.profilesHasFavoriteTopics) {
  // Query profiles table
}

// Always return default if no data
return { favorite_topics: [], user_id: user.id };
```

### 3. Intelligent Updates

```typescript
// Update correct table based on schema
if (schema.preferencesTableExists) {
  await supabase.from("preferences").upsert({...});
} else if (schema.profilesHasFavoriteTopics) {
  await supabase.from("profiles").update({...});
}
```

## 🎉 Benefits

1. ✅ **Never crashes on missing tables/columns**
2. ✅ **Always returns consistent data structure**
3. ✅ **Automatically adapts to database schema**
4. ✅ **Comprehensive error logging for debugging**
5. ✅ **Performance optimized with caching**
6. ✅ **Graceful fallbacks for all scenarios**

## 🔍 Error Codes Handled

| Code       | Meaning               | Action               |
| ---------- | --------------------- | -------------------- |
| `42P01`    | Table does not exist  | Try fallback table   |
| `42703`    | Column does not exist | Skip that table      |
| `PGRST116` | No rows returned      | Return default data  |
| `23503`    | Foreign key violation | Log and try fallback |
| `42501`    | Permission denied     | Log RLS policy issue |
| `23505`    | Unique constraint     | Log duplicate entry  |

## 🚀 Usage

The service now works regardless of your database schema:

- ✅ **Only `profiles` table with `favorite_topics`** → Uses profiles
- ✅ **Only `preferences` table** → Uses preferences
- ✅ **Both tables exist** → Prefers preferences, falls back to profiles
- ✅ **Neither table/column exists** → Returns defaults and logs migration needed

**No more crashes, always safe data! 🛡️**
