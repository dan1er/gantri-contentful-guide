# Gantri Quick Start Guide - Contentful CMS

A dynamic documentation site built with Next.js and Contentful CMS for the Gantri Design System.

## Features

- 🎨 Dynamic page creation via Contentful
- 📦 Reusable component system
- 🖼️ Image optimization with Next.js Image
- 📱 Responsive design
- ✨ Beautiful animations and interactions
- 🔍 SEO optimized

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **CMS**: Contentful
- **Styling**: CSS Modules
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or later
- Contentful account
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file with:

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## Contentful Content Types

- **Page**: Dynamic pages with slug routing
- **Panel Component**: Reusable content panels
- **Modal Component**: Popup content
- **Navigation Item**: Menu structure
- **Site Configuration**: Global settings
- **Product Category**: Product types
- **Milestone**: Step-by-step items

## Deployment to Vercel

### Option 1: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables when asked.

### Option 2: Via GitHub

1. Push your code to GitHub
2. Import the repository in Vercel Dashboard
3. Add environment variables in Vercel project settings
4. Deploy

### Option 3: Direct Deploy

1. Visit [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure environment variables:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_PREVIEW_TOKEN`
4. Click Deploy

## Environment Variables in Vercel

Add these in your Vercel project settings:

- `CONTENTFUL_SPACE_ID`: Your Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN`: Content Delivery API token
- `CONTENTFUL_PREVIEW_TOKEN`: Preview API token (optional)

## Post-Deployment

After deploying:

1. Update your domain settings if using a custom domain
2. Enable ISR (Incremental Static Regeneration) for dynamic content
3. Monitor performance in Vercel Analytics

## Content Management

1. Log in to Contentful
2. Create/edit content
3. Publish changes
4. Content updates automatically appear on the site (with ISR)

## License

MIT