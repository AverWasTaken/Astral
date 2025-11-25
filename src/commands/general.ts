import { Message, PermissionFlagsBits, time, TimestampStyles } from 'discord.js';
import { searchYoutube } from '../utils/youtube.js';
import { fetchTenorGif } from '../utils/tenor.js';
import { saveLearnedWords } from '../config.js';

/**
 * Handle $hello command
 */
export async function handleHello(message: Message): Promise<void> {
  await message.reply(`Hello ${message.author}!`);
}

/**
 * Handle $learn command
 */
export async function handleLearn(
  message: Message,
  learnedWords: Record<string, string>
): Promise<void> {
  if (!message.reference) {
    await message.reply('Please reply to a message to teach me!');
    return;
  }

  if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
    await message.reply("You can't teach me bro 😭 you need perms.");
    return;
  }

  try {
    const repliedMsg = await message.channel.messages.fetch(message.reference.messageId);
    const phrase = repliedMsg.content.toLowerCase();
    const response = message.content.slice(6).trim();

    if (response) {
      learnedWords[phrase] = response;
      saveLearnedWords(learnedWords);
      await message.channel.send(`Ight bet, I learned that ${message.author.mention} ✅`);
    }

    try {
      await repliedMsg.delete();
    } catch {
      // Message may have been deleted already
    }
  } catch (error) {
    console.error('Error handling learn command:', error);
    await message.reply('Error learning from that message 😭');
  }
}

/**
 * Handle $purge command
 */
export async function handlePurge(message: Message, amount: number): Promise<void> {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
    await message.reply('You need manage messages permission to use this command!');
    return;
  }

  if (amount < 10 || amount > 200) {
    await message.reply(`${message.author.mention}, purge must be between 10–200 messages.`);
    return;
  }

  try {
    const deleted = await message.channel.bulkDelete(amount + 1, true);
    const msg = await message.channel.send(`✅ Purged ${deleted.size - 1} messages.`);

    setTimeout(() => {
      msg.delete().catch(() => {
        // Message may have been deleted already
      });
    }, 4000);
  } catch (error) {
    console.error('Error purging messages:', error);
    await message.reply('Error purging messages 😭');
  }
}

/**
 * Handle $ytvid command
 */
export async function handleYtvid(message: Message, query: string = 'interesting videos'): Promise<void> {
  try {
    const videos = await searchYoutube(query);
    await message.reply(`${message.author.mention}, check these out:\n${videos.join('\n')}`);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    await message.reply(`Error pulling videos 😭`);
  }
}

/**
 * Handle $laugh command
 */
export async function handleLaugh(message: Message): Promise<void> {
  try {
    const gifUrl = await fetchTenorGif('laugh');
    if (gifUrl) {
      await message.channel.send(gifUrl);
    } else {
      await message.reply("Still couldn't find a gif 😭 (your Tenor key might be invalid)");
    }
  } catch (error) {
    console.error('Error fetching laugh GIF:', error);
    await message.reply('Error fetching GIF 😭');
  }
}

/**
 * Handle $kirk command (Charlie Kirk GIFs)
 */
export async function handleKirk(message: Message): Promise<void> {
  const kirkLinks = [
    'https://tenor.com/view/kirk-speed-kirk-trying-not-to-laugh-speed-trying-not-to-laugh-charlie-kirk-gif-8859915067900253017',
    'https://tenor.com/view/charlie-kirk-emote-rakai-dance-29mfs-gif-12334803904581020630',
    'https://tenor.com/view/charlie-kirk-67-gif-9005930415444340567',
    'https://tenor.com/view/get-a-load-of-this-guy-charlie-kirk-tbvnks-tbvnk-gif-13302194254499443283',
    'https://tenor.com/view/charlie-kirk-gif-10770034864984260690',
  ];

  const gifUrl = kirkLinks[Math.floor(Math.random() * kirkLinks.length)];
  await message.channel.send(gifUrl);
}

/**
 * Handle $heat command (Elmo fire GIFs)
 */
export async function handleHeat(message: Message): Promise<void> {
  const heatLinks = [
    'https://tenor.com/view/%CF%86%CF%89%CF%84%CE%B9%CE%AC-%CE%BC-gif-7038160376221917477',
    'https://tenor.com/view/elmo-elmos-fire-elmo-fire-fire-yas-gif-15688311340577229287',
  ];

  const gifUrl = heatLinks[Math.floor(Math.random() * heatLinks.length)];
  await message.channel.send(gifUrl);
}

