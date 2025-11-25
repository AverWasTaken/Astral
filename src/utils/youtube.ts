import { google } from 'googleapis';
import { config } from '../config.js';

const youtube = google.youtube({
  version: 'v3',
  auth: config.youtube.apiKey,
});

/**
 * Search YouTube for videos based on a query
 */
export async function searchYoutube(
  query: string,
  maxResults: number = config.youtube.maxResults
): Promise<string[]> {
  const publishedAfter = new Date();
  publishedAfter.setFullYear(publishedAfter.getFullYear() - config.youtube.publishedWithinYears);

  try {
    const response = await youtube.search.list({
      q: query,
      part: ['snippet'],
      type: ['video'],
      maxResults,
      order: 'viewCount',
      publishedAfter: publishedAfter.toISOString(),
    });

    const videos: string[] = [];

    for (const item of response.data.items || []) {
      const videoId = item.id?.videoId;
      if (!videoId) continue;

      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const title = item.snippet?.title || 'Unknown';
      const channel = item.snippet?.channelTitle || 'Unknown';
      const lowerTitle = title.toLowerCase();

      if (config.youtube.blockKeywords.some((keyword) => lowerTitle.includes(keyword))) {
        continue;
      }

      videos.push(`${title} by ${channel} - ${url}`);
    }

    if (videos.length === 0) {
      return ["Couldn't find any quality videos 😅"];
    }

    return videos.slice(0, Math.min(2, videos.length));
  } catch (error) {
    console.error('YouTube search error:', error);
    return ['Error searching YouTube 😭'];
  }
}

