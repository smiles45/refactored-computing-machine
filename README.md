<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1c7SZG_0RPmbRjdDE8UeXS6IxUm2XlnIK

## Run Locally

**Prerequisites:**  Node.js

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to SQL Editor and run the SQL from `supabase-schema.sql` to create the database tables
   - Go to Project Settings > API to get your credentials

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

The app will now persist all inventory and transaction data to Supabase, so your data will be saved even after refreshing the page!

### PWA (Progressive Web App) Features

This app is a **Progressive Web App (PWA)** that can be installed on your device:

- **Offline Support**: Works offline with cached resources
- **Installable**: Can be installed on mobile and desktop devices
- **Auto-updates**: Automatically updates when new versions are available
- **App-like Experience**: Runs in standalone mode without browser UI

**To install:**
1. Visit the app in a supported browser (Chrome, Edge, Safari)
2. Look for the install prompt or use the browser's install option
3. The app will be added to your home screen/app launcher

**Note:** You'll need to create PWA icons (`icon-192.png` and `icon-512.png`) in the `public/` folder. See `public/ICONS_README.md` for details.

### Typography

The app uses **Poppins** font family from Google Fonts for a modern, clean look. The font is automatically loaded and configured.

### Database Schema

The app uses two main tables:
- **inventory**: Stores product inventory items (id, name, size, quantity)
- **transactions**: Stores all stock movements (stock in, stock out, returns, adjustments)

See `supabase-schema.sql` for the complete schema definition.
