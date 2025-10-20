# Alexa RSS Proxy

Serverless RSS proxy to optimize news feeds for Alexa Flash Briefing.

## Problem

Alexa Flash Briefing **only reads the `description` field from RSS feeds**, completely ignoring the `title`. This causes news to start playing without context - you hear the content but don't know what the news is about.

## Solution

This project is a serverless function that:
1. Fetches the original RSS feed from [El Salvador Times](https://www.elsalvadortimes.com/rss/)
2. Combines the title and description of each news item into a single field
3. Returns a new RSS feed optimized for Alexa

**Result:** Alexa now reads the title first, followed by the content, providing full context for each news item.

## Tech Stack

- **Node.js** - Server runtime
- **Vercel** - Serverless platform (on-demand functions)
- **rss-parser** - Library to parse the original RSS feed
- **pnpm** - Package manager

## Architecture

```
Alexa Skill → Vercel Serverless Function → El Salvador Times RSS → Processing → Optimized Feed → Alexa
```

### How it works technically

1. **Serverless Function**: Deployed on Vercel as an on-demand function at `api/rss.js`
2. **No permanent server**: Only executes when Alexa makes an HTTP request
3. **Real-time processing**:
   - Each request fetches the latest news
   - Cleans HTML tags and special characters
   - Combines title + description
   - Manually constructs valid RSS XML
4. **30-minute cache**: `Cache-Control` header optimizes performance
5. **Top 5 news**: Only returns the 5 most recent news items

## Installation

```bash
# Clone repository
git clone https://github.com/victor0899/alexa-rss-proxy.git
cd alexa-rss-proxy

# Install dependencies
pnpm install
```

## Local Development

```bash
# Run development server with Vercel CLI
pnpm dlx vercel dev
```

The endpoint will be available at `http://localhost:3000/api/rss`

## Deployment

```bash
# Deploy to production on Vercel
pnpm dlx vercel --prod
```

## Usage with Alexa

A public Alexa Skill is currently pending approval in the Alexa Skills Store. Once approved, you'll be able to enable it directly on your Alexa device.

## Transformation Example

**Original RSS:**
```xml
<item>
  <title>Nueva ley aprobada en la Asamblea</title>
  <description>El contenido completo de la noticia...</description>
</item>
```

**Optimized RSS for Alexa:**
```xml
<item>
  <title>Nueva ley aprobada en la Asamblea</title>
  <description>Nueva ley aprobada en la Asamblea. El contenido completo de la noticia...</description>
</item>
```

Now Alexa reads: *"Nueva ley aprobada en la Asamblea. El contenido completo de la noticia..."*

## License

ISC
