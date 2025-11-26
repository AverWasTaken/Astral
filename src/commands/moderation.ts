import { Message, EmbedBuilder, PermissionFlagsBits, GuildMember } from 'discord.js';

/**
 * Handle $mute command
 */
export async function handleMute(
  message: Message,
  member: GuildMember | undefined,
  minutes: number,
  reason: string = 'No reason provided'
): Promise<void> {
  if (!member) {
    await message.reply('Member not found!');
    return;
  }

  if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    await message.reply('You need moderate members permission!');
    return;
  }

  try {
    const duration = minutes * 60 * 1000;
    await member.timeout(duration, reason);
    await message.reply(`${member.user.toString()} muted for ${minutes} minutes.\nReason: ${reason}`);
  } catch (error) {
    console.error('Error muting member:', error);
    await message.reply('Error muting member 😭');
  }
}

/**
 * Handle $unmute command
 */
export async function handleUnmute(message: Message, member: GuildMember | undefined): Promise<void> {
  if (!member) {
    await message.reply('Member not found!');
    return;
  }

  if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    await message.reply('You need moderate members permission!');
    return;
  }

  try {
    await member.timeout(null, 'Unmuted');
    await message.reply(`${member.user.toString()} has been unmuted.`);
  } catch (error) {
    console.error('Error unmuting member:', error);
    await message.reply('Error unmuting member 😭');
  }
}

/**
 * Handle $ban command
 */
export async function handleBan(
  message: Message,
  member: GuildMember | undefined,
  reason: string | null = null
): Promise<void> {
  if (!member) {
    await message.reply('Member not found!');
    return;
  }

  if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
    await message.reply('You need ban members permission!');
    return;
  }

  try {
    try {
      await member.send(`You were banned from ${message.guild?.name}.\nReason: ${reason}`);
    } catch {
      // User may have DMs disabled
    }

    await member.ban({ reason: reason ?? undefined });

    const embed = new EmbedBuilder()
      .setTitle('🔨 User Banned')
      .setDescription(`${member} banned.\nReason: ${reason}`)
      .setColor(0xff0000)
      .setImage('https://i.imgur.com/6YV2G7U.png');

    if (message.channel.isSendable()) {
      await message.channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error banning member:', error);
    await message.reply('Error banning member 😭');
  }
}

/**
 * Handle $kick command
 */
export async function handleKick(
  message: Message,
  member: GuildMember | undefined,
  reason: string | null = null
): Promise<void> {
  if (!member) {
    await message.reply('Member not found!');
    return;
  }

  if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers)) {
    await message.reply('You need kick members permission!');
    return;
  }

  try {
    try {
      await member.send(`You were kicked from ${message.guild?.name}.\nReason: ${reason}`);
    } catch {
      // User may have DMs disabled
    }

    await member.kick(reason ?? undefined);

    const embed = new EmbedBuilder()
      .setTitle('⚽ User Kicked')
      .setDescription(`${member} kicked.\nReason: ${reason}`)
      .setColor(0xffa500)
      .setImage('https://imgur.com/gallery/brazilian-grandpa-SSUbBKJ');

    if (message.channel.isSendable()) {
      await message.channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error kicking member:', error);
    await message.reply('Error kicking member 😭');
  }
}

