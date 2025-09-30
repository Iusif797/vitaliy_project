# Parazita Kusok Website

A premium e-commerce platform for exclusive stickers, sticker packs, sticker books, and original print merchandise.

## Responsive Design Excellence

The website delivers a flawless, device-agnostic experience:

- **Mobile** (up to 640px)
- **Tablet** (641px – 1024px)
- **Desktop** (1025px and above)

### Mobile-First Highlights

1. **Intuitive Navigation**  
   - Sleek, collapsible mobile menu with a modern category grid  
   - Space-saving, toggleable search bar  
   - Smooth horizontal category scrolling on tablets  

2. **Adaptive Card Grid**  
   - Two-column layout on mobile  
   - Three columns on tablets  
   - Five columns on desktop for maximum product visibility  

3. **Content Optimization**  
   - Responsive, legible typography for every device  
   - Smart spacing and padding for compact screens  
   - Touch-friendly buttons (minimum 44×44px) for effortless interaction  

4. **Performance**  
   - Lazy image loading for instant page speed  
   - Mobile-first optimizations for lightning-fast browsing  

## Mobile Testing Guide

### Local Testing Steps

1. Launch a local server:
   ```bash
   python -m http.server 8000
   ```
   or
   ```bash
   npm run start
   ```

2. Open in your browser:
   ```
   http://localhost:8000
   ```

3. Use browser dev tools to emulate devices:
   - Chrome DevTools > Toggle Device Toolbar
   - Firefox > Responsive Design Mode

### Supported Devices

- iPhone SE / 5 / 5S (320px)
- iPhone 6–8 (375px)
- iPhone X/11/12/13/14 (390px)
- iPhone Plus/Max/Pro Max (428px)
- Google Pixel (393px)
- Samsung Galaxy S/A Series (360–412px)
- iPad Mini/Air/Pro (768–1024px)

## Deployment

Live on Vercel:  
 

## Project Structure

- `/assets` — all images and media
- `/components` — reusable HTML components (header, footer, etc.)
- `/js` — JavaScript files
- `index.html` — main landing page

## Key Features

- Fully responsive, mobile-optimized design
- Modular component architecture for scalability
- Tailwind CSS for cutting-edge styling
- Dynamic component loading via JavaScript

## Getting Started

You can use any local web server. For example, with Python: