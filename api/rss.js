const Parser = require('rss-parser');

module.exports = async (req, res) => {
  try {
    const parser = new Parser();
    const originalFeed = await parser.parseURL('https://www.elsalvadortimes.com/rss/');
    
    let rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>El Salvador Times</title>
    <description>Ultimas noticias de El Salvador</description>
    <link>https://www.elsalvadortimes.com</link>`;

    originalFeed.items.slice(0, 5).forEach(item => {
      const title = (item.title || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const description = (item.contentSnippet || item.description || '')
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      const combinedText = `${title}. ${description}`;
      const guid = item.guid || item.link;
      const pubDate = item.pubDate || new Date().toUTCString();

      rssXML += `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${combinedText}]]></description>
      <link>${item.link}</link>
      <guid>${guid}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    });

    rssXML += `
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800');
    res.status(200).send(rssXML);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al generar RSS');
  }
};