const fs = require('fs');
const path = require('path');

// Ensure server/data exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .trim();
}

function extractExcerpt(html, maxLen = 220) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

function calculateReadTime(html) {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
}

const articles = [];

// 1. BRAINGRID ARTICLES
if (fs.existsSync('bg_articles.json')) {
  const bg = JSON.parse(fs.readFileSync('bg_articles.json', 'utf8'));
  for (const item of bg) {
    const cleaned = cleanHtml(item.content);
    articles.push({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle,
      content: cleaned,
      excerpt: item.subtitle || extractExcerpt(cleaned),
      coverImage: item.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      domain: item.domain, // ai, devops, development
      tags: [item.domain, 'engineering', item.slug.split('-')[0]],
      readTime: calculateReadTime(cleaned),
      status: 'published',
      publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000)
    });
  }
}

// 2. SUBSTACK ARTICLES
if (fs.existsSync('substack_feed.xml')) {
  const feed = fs.readFileSync('substack_feed.xml', 'utf8');
  const items = [...feed.matchAll(/<item>(.*?)<\/item>/gs)];
  for (const item of items) {
    const content = item[1];
    const titleMatch = content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    if (title.toLowerCase().includes('coming soon')) continue;

    const encodedMatch = content.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s);
    const pubDateMatch = content.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = content.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s) || content.match(/<description>(.*?)<\/description>/s);

    const body = encodedMatch ? cleanHtml(encodedMatch[1]) : '';
    const desc = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';

    let domain = 'devops';
    let coverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
    let tags = ['devops', 'software-engineering', 'delivery'];

    if (title.toLowerCase().includes('devrel') || title.toLowerCase().includes('no one told me')) {
      domain = 'devrel';
      coverImage = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80';
      tags = ['devrel', 'developer-relations', 'career', 'advocacy'];
    }

    articles.push({
      title,
      subtitle: desc,
      content: body,
      excerpt: desc || extractExcerpt(body),
      coverImage,
      domain,
      tags,
      readTime: calculateReadTime(body),
      status: 'published',
      publishedAt: pubDateMatch ? new Date(pubDateMatch[1]) : new Date()
    });
  }
}

// 3. MEDIUM PAYMAN ARTICLES
if (fs.existsSync('payman_feed.xml')) {
  const feed = fs.readFileSync('payman_feed.xml', 'utf8');
  const items = [...feed.matchAll(/<item>(.*?)<\/item>/gs)];
  for (const item of items) {
    const content = item[1];
    const titleMatch = content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    if (!title || title.includes('Payman AI - Medium')) continue;

    const encodedMatch = content.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/s);
    const pubDateMatch = content.match(/<pubDate>(.*?)<\/pubDate>/);
    const body = encodedMatch ? cleanHtml(encodedMatch[1]) : '';

    articles.push({
      title,
      subtitle: title.includes('Slack') ? 'Build a Slack AI agent that processes payments through API integration' : 'Build a Telegram bot that triggers ACH transfers on agent rails',
      content: body,
      excerpt: extractExcerpt(body),
      coverImage: title.includes('Slack') 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      domain: 'development',
      tags: ['development', 'bots', 'api-integration', 'payments'],
      readTime: calculateReadTime(body),
      status: 'published',
      publishedAt: pubDateMatch ? new Date(pubDateMatch[1]) : new Date()
    });
  }
}

// 4. OPTEXITY NEWSLETTER ARTICLE
articles.push({
  title: 'Optexity: The DevRel & Technical Content Strategy Field Guide',
  subtitle: 'Developer advocacy insights, AI tooling updates, documentation engineering, and content strategy breakdowns.',
  content: `
<h2>Introduction: The Changing Landscape of Developer Relations</h2>
<p>Developer advocacy is undergoing a fundamental shift. In the era of autonomous agents, AI-assisted development, and API-first platforms, DevRel is no longer just about giving conference talks or handing out stickers at hackathons. Today, the most effective Developer Relations engineers are technical marketers, SDK architects, documentation engineers, and community champions rolled into one.</p>

<hr />

<h2>The 4 Pillars of Modern Developer Advocacy</h2>
<ul>
  <li><strong>1. SDKs and Developer Experience (DX):</strong> If a developer cannot copy-paste your code snippet and make a successful call in under 3 minutes, they will close the tab. Your documentation and quickstart guides are your primary product interface.</li>
  <li><strong>2. Technical Content that Solves Real Problems:</strong> High-signal tutorials, post-mortems, and architectural benchmarks generate lasting authority. Avoid fluff; build working repositories that developers can clone and fork.</li>
  <li><strong>3. AI Tooling & Context Engineering:</strong> Equipping your developer community with MCP servers, Claude Skills, and agent-ready prompt instructions makes your platform natively accessible to modern AI workflows.</li>
  <li><strong>4. Bi-directional Feedback Loops:</strong> Serving as the voice of the developer inside your product engineering teams. When developers hit API roadblocks or error response friction, DevRel ensures those findings turn into immediate GitHub issues and product fixes.</li>
</ul>

<hr />

<h2>Building a Sustainable Technical Content Engine</h2>
<p>When creating technical content, follow the Rule of Three: one working GitHub repository should yield one in-depth architectural tutorial, one short interactive demo video, and one actionable social breakdown. This multiplies developer reach while keeping technical accuracy at 100%.</p>

<blockquote>"The best developer marketing doesn't look like marketing. It looks like great engineering, clear documentation, and tools that respect a developer's time."</blockquote>

<h2>Conclusion</h2>
<p>As developer ecosystems grow increasingly automated, the human element of DevRel becomes even more vital. Clear communication, empathetic troubleshooting, and first-class developer tooling will always be the competitive advantage of legendary platforms.</p>
`,
  excerpt: 'Developer advocacy insights, AI tooling updates, documentation engineering, and content strategy breakdowns for modern engineering teams.',
  coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  domain: 'devrel',
  tags: ['devrel', 'community', 'content-strategy', 'developer-experience'],
  readTime: 6,
  status: 'published',
  publishedAt: new Date(Date.now() - 2 * 86400000)
});

// 5. HASHNODE ARTICLES (Non-Web3 only)
if (fs.existsSync('hashnode_valid.json')) {
  const hashnode = JSON.parse(fs.readFileSync('hashnode_valid.json', 'utf8'));
  for (const item of hashnode) {
    const cleaned = cleanHtml(item.content);
    let domain = item.domain;
    if (item.title.toLowerCase().includes('sendgrid') || item.title.toLowerCase().includes('email')) {
      domain = 'development';
    }

    articles.push({
      title: item.title,
      subtitle: extractExcerpt(cleaned, 120),
      content: cleaned,
      excerpt: extractExcerpt(cleaned),
      coverImage: item.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      domain: domain,
      tags: [domain, 'tutorial', 'code'],
      readTime: calculateReadTime(cleaned),
      status: 'published',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
    });
  }
}

const outputPath = path.join(dataDir, 'articles.json');
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));

console.log(`Successfully generated ${articles.length} articles!`);
const domainCounts = {};
for (const a of articles) {
  domainCounts[a.domain] = (domainCounts[a.domain] || 0) + 1;
}
console.log('Domain breakdown:', domainCounts);
