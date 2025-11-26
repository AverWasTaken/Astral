import {
  Client,
  IntentsBitField,
  Message,
  ChannelType,
  GuildMember,
} from 'discord.js';
import { config, loadLearnedWords, saveLearnedWords } from './config.js';
import { generateHumanResponse, getFilterResponse } from './utils/responses.js';
import * as general from './commands/general.js';
import * as moderation from './commands/moderation.js';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

let learnedWords = loadLearnedWords();

/**
 * Bot ready event
 */
client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user?.tag}`);
});

/**
 * Guild member join event
 */
client.on('guildMemberAdd', async (member) => {
  try {
    await member.send(`Welcome to the server ${member.user.username}!`);
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }
});

/**
 * Message create event - main event handler
 */
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Check learned words
  for (const [word, response] of Object.entries(learnedWords)) {
    if (content.includes(word)) {
      try {
        await message.delete();
        if (message.channel.isTextBased()) {
          await message.channel.send(`${message.author.toString()}, ${response}`);
        }
        return;
      } catch (error) {
        console.error('Error handling learned word:', error);
      }
    }
  }

  // Check filter keywords
  const filterResponse = getFilterResponse(content);
  if (filterResponse) {
    try {
      await message.delete();
      if (message.channel.isTextBased()) {
        await message.channel.send(`${message.author.toString()}, ${filterResponse}`);
      }
      return;
    } catch (error) {
      console.error('Error handling filter:', error);
    }
  }

  // Handle $learn command (with reply)
  if (content.startsWith('$learn') && message.reference) {
    await general.handleLearn(message, learnedWords);
    return;
  }

  // Handle mentions
  if (message.mentions.has(client.user!)) {
    try {
      const response = await generateHumanResponse(content, message.author.toString(), learnedWords);
      await message.reply(response);
    } catch (error) {
      console.error('Error generating response:', error);
    }
    return;
  }

  // Process commands
  if (!content.startsWith(config.discord.commandPrefix)) return;

  const args = content.slice(config.discord.commandPrefix.length).trim().split(/\s+/);
  const command = args[0];

  try {
    switch (command) {
      case 'hello':
        await general.handleHello(message);
        break;

      case 'learn':
        if (args.length < 2) {
          await message.reply('Usage: $learn <phrase> <response>');
          break;
        }
        {
          const phrase = args[1].toLowerCase();
          const response = args.slice(2).join(' ');
          if (response) {
            learnedWords[phrase] = response;
            saveLearnedWords(learnedWords);
            await message.reply(`I learned: '${phrase}' → '${response}'`);
          }
        }
        break;

      case 'purge': {
        const amount = parseInt(args[1]) || 10;
        await general.handlePurge(message, amount);
        break;
      }

      case 'ytvid': {
        const query = args.slice(1).join(' ') || 'interesting videos';
        await general.handleYtvid(message, query);
        break;
      }

      case 'laugh':
        await general.handleLaugh(message);
        break;

      case 'kirk':
        await general.handleKirk(message);
        break;

      case 'heat':
        await general.handleHeat(message);
        break;

      case 'mute': {
        const targetUser = message.mentions.users.size > 0 ? [...message.mentions.users.values()][0] : undefined;
        const member = message.guild?.members.cache.get(targetUser?.id!);
        const minutes = parseInt(args[2]) || 5;
        const reason = args.slice(3).join(' ') || 'No reason provided';
        await moderation.handleMute(message, member, minutes, reason);
        break;
      }

      case 'unmute': {
        const targetUser = message.mentions.users.size > 0 ? [...message.mentions.users.values()][0] : undefined;
        const member = message.guild?.members.cache.get(targetUser?.id!);
        await moderation.handleUnmute(message, member);
        break;
      }

      case 'ban': {
        const targetUser = message.mentions.users.size > 0 ? [...message.mentions.users.values()][0] : undefined;
        const member = message.guild?.members.cache.get(targetUser?.id!);
        const reason = args.slice(2).join(' ') || null;
        await moderation.handleBan(message, member, reason);
        break;
      }

      case 'kick': {
        const targetUser = message.mentions.users.size > 0 ? [...message.mentions.users.values()][0] : undefined;
        const member = message.guild?.members.cache.get(targetUser?.id!);
        const reason = args.slice(2).join(' ') || null;
        await moderation.handleKick(message, member, reason);
        break;
      }

      default:
        // Unknown command - silently ignore
        break;
    }
  } catch (error) {
    console.error('Error processing command:', error);
    await message.reply('An error occurred while processing your command 😭').catch(() => {
      // Message may have been deleted
    });
  }
});

/**
 * Error handler
 */
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Login to Discord
 */
if (!config.discord.token) {
  console.error('❌ TOKEN environment variable is not set!');
  process.exit(1);
}

client.login(config.discord.token);

