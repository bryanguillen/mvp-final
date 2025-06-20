# Static Marketing Site

A responsive marketing landing page demonstrating the AI chat bot integration. Built with vanilla HTML and Tailwind CSS, showcasing a medical spa use case with embedded chat functionality.

## 🚀 Tech Stack

- **HTML5**: Semantic markup with accessibility in mind
- **Tailwind CSS 2.2.19**: Utility-first CSS framework via CDN
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Static Hosting**: Compatible with any static file hosting service

## ✨ Features

- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Modern Design**: Clean, professional aesthetic with soft color palette
- **Call-to-Action Integration**: Strategic placement of booking and contact elements
- **SEO-Friendly**: Proper meta tags and semantic HTML structure
- **Fast Loading**: Minimal dependencies with CDN-hosted assets
- **Accessibility**: WCAG-compliant markup and navigation

## 🎨 Current Theme: Medical Spa

The site currently showcases "Radiant Aesthetics Studio" with:
- **Services**: Botox injections, luxury facials, lip enhancements
- **Branding**: Pink color scheme with elegant typography
- **Content**: Professional medical spa messaging
- **Integration**: Calendly booking integration

## 📁 Project Structure

```
static-site/
└── index.html              # Main landing page
```

## 🛠️ Development

### Local Development

**Node.js (http-server):**
```bash
npx http-server static-site -p 8000
# Visit http://localhost:8000
```

**Live Server (VS Code Extension):**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 🎨 Customization

### Brand Customization

**Colors:**
```html
<!-- Current: Pink theme -->
<header class="bg-pink-100 p-6 shadow-md">
<section class="text-center py-20 bg-pink-50">
<a href="#contact" class="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded">

<!-- Example: Blue theme -->
<header class="bg-blue-100 p-6 shadow-md">
<section class="text-center py-20 bg-blue-50">
<a href="#contact" class="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded">
```

**Content Sections:**
- **Header**: Company name and navigation
- **Hero**: Main headline and call-to-action
- **Services**: Feature grid with service descriptions
- **About**: Team/company information
- **Contact**: Contact form and booking integration
- **Footer**: Copyright and additional links
