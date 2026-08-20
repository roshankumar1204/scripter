import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export interface ScrapedPage {
  sourceUrl: string;
  markdown: string;
}

export async function crawlDocSite(startUrl: string, limit = 20): Promise<ScrapedPage[]> {
  const result = await firecrawl.crawlUrl(startUrl, {
    limit,
    scrapeOptions: {
      formats: ['markdown'],
      onlyMainContent: true,
    },
  });

  if (result.status !== 'completed' || !result.data) {
    throw new Error(`Firecrawl crawl failed: ${JSON.stringify(result)}`);
  }

  return result.data.map((page: any) => ({
    sourceUrl: page.metadata?.sourceURL || startUrl,
    markdown: page.markdown || '',
  }));
}

export async function scrapeSingleUrl(url: string): Promise<ScrapedPage> {
  const result = await firecrawl.scrapeUrl(url, {
    formats: ['markdown'],
    onlyMainContent: true,
  });

  if (!result.success) {
    throw new Error(`Firecrawl scrape failed: ${JSON.stringify(result)}`);
  }

  return {
    sourceUrl: url,
    markdown: result.markdown || '',
  };
}