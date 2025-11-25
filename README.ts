/**
 * Discord Bot - TypeScript Edition
 * 
 * A Discord bot written entirely in TypeScript using discord.js
 * 
 * ## Setup
 * 
 * 1. Install dependencies:
 *    npm install
 * 
 * 2. Create a .env file with:
 *    DISCORD_TOKEN=your_discord_bot_token_here
 *    YOUTUBE_API_KEY=your_youtube_api_key_here
 *    TENOR_API_KEY=your_tenor_api_key_here
 * 
 * 3. Build and run:
 *    npm run build
 *    npm start
 * 
 *    Or for development:
 *    npm run dev
 * 
 * ## Project Structure
 * 
 * - src/
 *   - index.ts         - Main bot file with event handlers
 *   - config.ts        - Configuration and environment loading
 *   - utils/
 *     - youtube.ts     - YouTube search functionality
 *     - tenor.ts       - Tenor GIF fetching
 *     - responses.ts   - Response generation logic
 *   - commands/
 *     - general.ts     - General commands (hello, learn, ytvid, laugh, kirk, heat)
 *     - moderation.ts  - Moderation commands (mute, unmute, ban, kick)
 * 
 * ## Commands
 * 
 * **General:**
 * - $hello                    - Greet the bot
 * - $learn <phrase> <response> - Teach the bot a response
 * - $purge <amount>           - Delete messages (10-200)
 * - $ytvid [query]            - Search and share YouTube videos
 * - $laugh                    - Share a random laugh GIF
 * - $kirk                     - Share a random Charlie Kirk GIF
 * - $heat                     - Share a random heat/fire GIF
 * 
 * **Moderation:**
 * - $mute <@user> <minutes> [reason] - Mute a user
 * - $unmute <@user>                  - Unmute a user
 * - $ban <@user> [reason]            - Ban a user
 * - $kick <@user> [reason]           - Kick a user
 * 
 * **Features:**
 * - Automatic filtering of inappropriate language
 * - Learned responses stored in learned.json
 * - Human-like message responses when mentioned
 * - Full moderation suite
 * - YouTube video search and recommendations
 * - Tenor GIF integration
 */

