import { config } from '../config.js';

const TENOR_API_URL = 'https://tenor.googleapis.com/v2/search';

/**
 * Fetch a GIF from Tenor API
 */
export async function fetchTenorGif(query: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: query,
      client_key: config.tenor.apiKey,
      limit: '30',
    });

    const response = await fetch(`${TENOR_API_URL}?${params}`);
    const data = (await response.json()) as any;
    const results = data.results || [];

    if (!results.length) {
      console.warn('No Tenor results found for query:', query);
      return null;
    }

    const gifObj = results[Math.floor(Math.random() * results.length)];
    const mediaFormats = gifObj.media_formats || {};

    for (const key of ['gif', 'mediumgif', 'tinygif', 'nanogif']) {
      if (key in mediaFormats && mediaFormats[key].url) {
        return mediaFormats[key].url;
      }
    }

    return null;
  } catch (error) {
    console.error('Tenor API error:', error);
    return null;
  }
}

