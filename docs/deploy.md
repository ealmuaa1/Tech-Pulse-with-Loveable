# Deployment Guide

## SPA Routing Configuration

This Vite + React SPA uses client-side routing with React Router. To ensure direct route access works correctly on Vercel, we've configured the following:

### Vercel Configuration

The `vercel.json` file contains a rewrite rule that redirects all routes to `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This allows the React Router to handle client-side routing for all paths.

### Testing SPA Routing

#### Local Testing

1. Build the project: `npm run build`
2. Preview the build: `vite preview`
3. Navigate to nested routes directly (e.g., `http://localhost:4173/profile`)
4. Verify that routes load correctly and the SPA remains loaded

#### Vercel Testing

1. Deploy to Vercel
2. After deployment, test direct route access:
   - Open `/profile` directly in a new tab
   - Open `/learn/ai-fundamentals` directly
   - Open `/summary/any-id` directly
3. Verify that routes load correctly without 404 errors

### Router Configuration

- Uses `<BrowserRouter>` without basename
- All internal navigation uses `<Link to="...">` components
- Includes a catch-all route (`path="*"`) that shows a friendly 404 component
- The 404 page keeps the SPA loaded and provides navigation back to home

### Troubleshooting

If you encounter 404 errors on direct routes:

1. Verify `vercel.json` is in the repository root
2. Check that the rewrite rule is correct
3. Ensure the build process completes successfully
4. Clear Vercel cache if needed
