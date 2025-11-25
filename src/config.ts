import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * Environment and configuration variables
 */
export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    commandPrefix: '$',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
    maxResults: 25,
    publishedWithinYears: 5,
    blockKeywords: [
      'short',
      'shorts',
      '#shorts',
      'meme',
      'memes',
      'compilation',
      'reaction',
      'tiktok',
      'prank',
      'try not to',
      'part 1',
      'part 2',
      'part 3',
    ],
  },
  tenor: {
    apiKey: process.env.TENOR_API_KEY || 'LIVDSRZULELA',
  },
  paths: {
    learnedFile: 'learned.json',
    logFile: 'discord.log',
  },
};

/**
 * Load learned words from storage
 */
export function loadLearnedWords(): Record<string, string> {
  try {
    if (fs.existsSync(config.paths.learnedFile)) {
      const data = fs.readFileSync(config.paths.learnedFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading learned words:', error);
  }
  return {};
}

/**
 * Save learned words to storage
 */
export function saveLearnedWords(words: Record<string, string>): void {
  try {
    fs.writeFileSync(config.paths.learnedFile, JSON.stringify(words, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving learned words:', error);
  }
}

