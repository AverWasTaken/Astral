import { searchYoutube } from './youtube.js';

const KEYWORDS: Record<string, string[]> = {
  'after effects': [
    'AE is crazy fun ngl 😭 what u tryna make?',
    'After Effects? say less fam, what effect u need?',
  ],
  edit: [
    'Editing grind never stops 😮‍💨 what u working on?',
    'Bet, you editing something heat?',
  ],
  help: [
    'Aight what u need help with gang? 👀',
    "Say it less, what's confusing u?",
  ],
  tutorial: [
    "Need a tutorial? I gotchu lil bro 😎",
    'Tutorial vibes? What u tryna do?',
  ],
};

const DEFAULT_RESPONSES = [
  'Yo {user}, wassup? 😎',
  'Talk to me {user} 👀',
  "What's good {user}? 😭",
  'Yoo {user}, whatchu need gang?',
  'Aye {user}, I\'m here wassup?',
];

const FILTER_KEYWORDS: Record<string, string> = {
  nigga: "Don't use that word twin!",
  'f you astral': "Don't diss me u lil shit!",
  nga: 'Tryna make variations now?',
  faggot: 'Sayin slurs is wild bro 💀',
};

/**
 * Generate a human-like response based on message content
 */
export async function generateHumanResponse(
  messageContent: string,
  authorMention: string,
  learnedWords: Record<string, string>
): Promise<string> {
  const content = messageContent.toLowerCase();

  // YouTube search
  if (content.includes('youtube') || content.includes('yt')) {
    let query = content.replace('youtube', '').replace('yt', '').trim();
    if (!query) {
      query = 'interesting videos';
    }
    const videos = await searchYoutube(query);
    return `${authorMention}, check these out:\n${videos.join('\n')}`;
  }

  // Learned words
  for (const [word, response] of Object.entries(learnedWords)) {
    if (content.includes(word)) {
      return response;
    }
  }

  // Keyword responses
  for (const [key, responses] of Object.entries(KEYWORDS)) {
    if (content.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Default response
  const defaultResponse = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
  return defaultResponse.replace('{user}', authorMention);
}

/**
 * Check if message contains filter keywords
 */
export function getFilterResponse(content: string): string | null {
  for (const [word, response] of Object.entries(FILTER_KEYWORDS)) {
    if (content.includes(word)) {
      return response;
    }
  }
  return null;
}

