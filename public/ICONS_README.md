# PWA Icons Setup

This app requires PWA icons for installation. You need to create two icon files:

## Required Icons

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## Creating Icons

You can create these icons using:

1. **Online Tools:**
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon.io](https://favicon.io/)

2. **Design Tools:**
   - Figma, Adobe Illustrator, or any image editor
   - Export as PNG with the exact dimensions

3. **Quick Solution:**
   - Use a simple logo or app name
   - Make sure the icons are square and have good contrast
   - Use a solid background color (recommended: #2563eb blue)

## Icon Guidelines

- **Format:** PNG
- **Sizes:** 192x192 and 512x512 pixels
- **Background:** Should work on both light and dark backgrounds
- **Content:** App logo or "StockFlow" text with icon

## Placement

Place the icons in the `public/` directory:
- `public/icon-192.png`
- `public/icon-512.png`

The app will automatically use these icons when installed as a PWA.

## Temporary Placeholder

If you don't have icons yet, you can create simple colored squares:
- Use a blue (#2563eb) background
- Add white text "SF" or a simple icon
- Save as PNG files with the required dimensions

