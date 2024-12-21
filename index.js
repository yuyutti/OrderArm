require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;
const OWNER_ID = process.env.OWNER_ID;

client.once('ready', () => {
    console.log('Logged in as ' + client.user.tag);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.author.id !== OWNER_ID) return;
    // コマンドと引数に分割
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // 以下コマンド処理

    if (command === 'clear') { // メッセージの一括削除
        const channelId = args[0] || message.channel.id;
        const channel = await client.channels.fetch(channelId);

        let messages;
        do {
            messages = await channel.messages.fetch({ limit: 100 });
            messages.forEach(message => {
                if (message.createdTimestamp < Date.now() - 1209600000) {
                    message.delete().catch(err => console.error('古いメッセージの削除中にエラーが発生しました:', err));
                }
            });
            await channel.bulkDelete(messages, true).catch(err => console.error('メッセージの一括削除中にエラーが発生しました:', err));
        } while (messages.size >= 2);
    }

    if (command === 'd') { // 指定したカテゴリー内のチャンネルを削除
        const categoryId = args[0];
        if (!categoryId) return message.reply('カテゴリーIDを指定してください。');

        const category = message.guild.channels.cache.get(categoryId);

        if (category && category.type === 'GUILD_CATEGORY') {
            category.children.forEach((channel) => {
            channel.delete()
                .then(() => console.log(`Deleted channel ${channel.name}`))
                .catch((error) => console.error(`Error deleting channel ${channel.name}: ${error}`));
            });
        } else console.error('Category not found or invalid category ID');
    }

    if (command === 'createVCs' || command === 'cvc') { // ボイスチャンネルの一括作成
        const categoryId = args[0];
        const channelNameTemplate = args[1];
        const countStart = parseInt(args[2]);
        const countEnd = parseInt(args[3]);
        console.log(args);
        if (!categoryId) return message.reply('カテゴリーIDを指定してください。');
        if (!channelNameTemplate) return message.reply('チャンネル名を指定してください。');
        if (isNaN(countStart)) return message.reply('有効な開始番号を指定してください。');
        if (isNaN(countEnd)) return message.reply('有効な終了番号を指定してください。');
        if (countStart > countEnd) return message.reply('開始番号は終了番号より小さくなければなりません。');

        const category = await message.guild.channels.cache.get(categoryId);

        for (let i = countStart; i <= countEnd; i++){
            const channelName = channelNameTemplate.includes('${i}')
            ? channelNameTemplate.replace('${i}', i)
            : channelNameTemplate;
            await message.guild.channels.create(channelName, {
                type: 'GUILD_VOICE',
                parent: category,
            });
        }

        await message.reply(`ボイスチャンネルが${countEnd}個作成されました！`);
    }

    if (command === 'set') { // カテゴリー内のボイスチャンネルの人数制限を一括設定
        const categoryId = args[0];
        const userLimit = parseInt(args[1]);
        if (!categoryId) return message.reply('カテゴリーIDを指定してください。');
        if (!userLimit) return message.reply('人数制限の値を指定してください。');

        const category = message.guild.channels.cache.get(categoryId);
        
        if (category && category.type === 'GUILD_CATEGORY') {
            const voiceChannels = category.children.filter(channel => channel.type === 'GUILD_VOICE');
            
            if (voiceChannels.size === 0) return message.reply('カテゴリー内にボイスチャンネルがありません。');
            
            voiceChannels.forEach(async voiceChannel => {
                await voiceChannel.edit({
                    userLimit: userLimit
                });
            });
        } else await message.reply(`指定されたカテゴリーは存在しないかカテゴリーではありません。`);
    }

    if (command === 'kick') { // 指定したロールを持たないメンバーを一括キック
        const targetRoleId = args[0].split(',');
        const kick_reason = args.slice(1).join(' ');

        if (!targetRoleId) return message.reply('ロールIDを指定してください。');
        if (!kick_reason) return message.reply('キック理由を指定してください。');

        try {
            await message.guild.members.fetch();
            message.guild.members.cache.forEach((member) => {
                const memberRoles = member.roles.cache;
                if (!targetRoleId.some(roleId => memberRoles.has(roleId))) {
                    member.kick(kick_reason)
                        .then((kickedMember) => {
                            console.log(`Kicked user: ${kickedMember.user.tag}`);
                        })
                        .catch(console.error);
                }
            });
        } catch (error) {
            console.error('メンバーの取得中にエラーが発生しました:', error);
        }
    }
});

// 全部テストしてません

client.login(TOKEN);