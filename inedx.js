const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const fs = require('fs');
const path = require('path')
// إعداد البوت




const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const { PREFIX, token } = require('./config.json')
const { joinVoiceChannel } = require("@discordjs/voice");

client.on("ready", async () => {
  //[]\\
  const statuses = [
    `Velros 2k?`,
    `افضل سيرفر`,
    `لساتك تبحث على افتار وانا موجود؟`,
    `40%`,
    `افضل العبارات بضغطة زر فقط`,
  ];
  console.log(`================`);
  console.log(`Velros`);
  console.log(`Bot Name : ${client.user.username}`);
  console.log(`Bot Tag : ${client.user.tag}`);
  console.log(`Bot Id : ${client.user.id}`);
  console.log(`Servers Count : ${client.guilds.cache.size}`);
  console.log(
    `Users Count : ${client.guilds.cache
      .reduce((total, guild) => total + guild.memberCount, 0)
      .toLocaleString()}`,
  );
  console.log(`VelrosBot Work`);
  console.log(`================`);
  //[]\\
  const updateIntervalInSeconds = 2;
  const updateIntervalInMilliseconds = updateIntervalInSeconds * 1000;

  const updateStatus = () => {
    const randomIndex = Math.floor(Math.random() * statuses.length);

    const selectedStatus = statuses[randomIndex];
    client.user.setActivity(selectedStatus, {
      type: `STREAMING`,
      url: `https://www.twitch.tv/Velros`,
    });
  };

  setInterval(updateStatus, updateIntervalInMilliseconds);
});


var VoiceChannel = `1387648547952001076`;
client.on("ready", () => {
  setInterval(async () => {
    client.channels
      .fetch(VoiceChannel)
      .then((channel) => {
        const VoiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
      })
      .catch((error) => {
        return;
      });
  }, 1000);
});


// إعدادات ثابتة

const DATA_PATH = './wordsProfile.json';
const data = JSON.parse(fs.readFileSync(DATA_PATH));
const phraseSessions = new Map();

// ✅ أوامر الكتابة
client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;

  // إضافة عبارة
  if (msg.content.startsWith(PREFIX + 'add-phrase')) {
    const parts = msg.content.split(' ');
    const cat = parts[1];
    const text = parts.slice(2).join(' ');

    if (!['arabic', 'english', 'quran'].includes(cat) || !text) {
      return msg.reply('📌 الاستخدام: `+add-phrase <arabic|english|quran> <النص>`');
    }

    data[cat].push(text);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    return msg.reply(`✅ تم إضافة العبارة إلى ${cat}`);
  }

  // إرسال واجهة الأدوات
  if (msg.content === PREFIX + 'profile-tools') {
    const embed = new EmbedBuilder()
      .setTitle('🧰 أدوات البروفايل')
      .setDescription('اختر أحد الخيارات بالأسفل')
      .setColor('#2F3136');

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('choose_phrase_cat')
        .setPlaceholder('🎚️ اختر تصنيف العبارات')
        .addOptions([
          { label: 'عبارات عربية', value: 'arabic' },
          { label: 'English phrases', value: 'english' },
          { label: 'آيات قرآنية', value: 'quran' }
        ])
    );

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('get_avatar').setLabel('📸 عرض الأفتار').setStyle('Primary'),
      new ButtonBuilder().setCustomId('get_banner').setLabel('🖼️ عرض البنر').setStyle('Primary')
    );

    await msg.reply({ embeds: [embed], components: [selectRow, buttonRow] });
  }
});

// ✅ اختيار التصنيف (Select Menu)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'choose_phrase_cat') return;

  const cat = interaction.values[0];
  const arr = data[cat] || [];
  const index = 0;

  phraseSessions.set(interaction.user.id, { cat, index });

  const embed = new EmbedBuilder()
    .setTitle(`📝 العبارات (${cat})`)
    .setDescription(arr[index] || 'لا توجد عبارات بعد.')
    .setColor('#7289DA');

  const navRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('prev').setLabel('◀️').setStyle('Secondary'),
    new ButtonBuilder().setCustomId('next').setLabel('▶️').setStyle('Secondary')
  );

  await interaction.reply({ embeds: [embed], components: [navRow], ephemeral: true });
});

// ✅ تنقل بين العبارات (prev/next)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (!['prev', 'next'].includes(interaction.customId)) return;

  const sess = phraseSessions.get(interaction.user.id);
  if (!sess) return;

  const arr = data[sess.cat];
  if (!arr || arr.length === 0) return;

  sess.index = interaction.customId === 'next'
    ? Math.min(arr.length - 1, sess.index + 1)
    : Math.max(0, sess.index - 1);

  const embed = new EmbedBuilder()
    .setTitle(`📝 العبارات (${sess.cat})`)
    .setDescription(arr[sess.index])
    .setColor('#7289DA');

  await interaction.update({ embeds: [embed] });
});

// ✅ زر فتح المودال
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (!['get_avatar', 'get_banner'].includes(interaction.customId)) return;

  const modal = new ModalBuilder()
    .setCustomId(`${interaction.customId}_modal`)
    .setTitle(interaction.customId === 'get_avatar' ? '📸 عرض أفتار عضو' : '🖼️ عرض بنر عضو')
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('target_user_id')
          .setLabel('🆔 أدخل ID العضو')
          .setStyle(1) // SHORT
          .setRequired(true)
      )
    );

  try {
    await interaction.showModal(modal);
  } catch (error) {
    console.error('فشل في عرض المودال:', error);
    await interaction.reply({ content: '❌ تعذر عرض المودال.', ephemeral: true });
  }
});

// ✅ استجابة المودال (عرض الأفتار أو البنر)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  const userId = interaction.fields.getTextInputValue('target_user_id');
  const member = await interaction.guild.members.fetch(userId).catch(() => null);
  if (!member) {
    return interaction.reply({ content: '❌ لم يتم العثور على العضو داخل السيرفر.', ephemeral: true });
  }

  const user = member.user;

  if (interaction.customId === 'get_avatar_modal') {
    await interaction.reply({ content: '📩 تم إرسال الأفتار في الخاص!', ephemeral: true });
    return interaction.user.send({
      content: `📸 الأفتار الخاص بـ ${user.tag}:`,
      files: [user.displayAvatarURL({ dynamic: true, size: 1024 })]
    }).catch(() => {});
  }

  if (interaction.customId === 'get_banner_modal') {
    await interaction.reply({ content: '📩 تم إرسال البنر في الخاص!', ephemeral: true });
    const fullUser = await user.fetch(true);
    const banner = fullUser.bannerURL({ dynamic: true, size: 1024 });

    if (!banner) {
      return interaction.user.send('❌ هذا المستخدم لا يملك بنر.').catch(() => {});
    }

    return interaction.user.send({
      content: `🖼️ البنر الخاص بـ ${user.tag}:`,
      files: [banner]
    }).catch(() => {});
  }
});



// إعدادات أساسية
const PREFIx = '+send-image';
const LOG_CHANNEL_ID = '1299415775475400739';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 دقائق
const USAGE_FILE = path.join(__dirname, 'buttonUsage.json');

// 🔁 خريطة الرومات وأنواع التصاميم
const ROOM_DATA = {
  '1381752348380233810': { label: 'Avatar Boys', type: 'أفتار' },
  '1387496430985416724': { label: 'Avatar Girls', type: 'أفتار' },
  '1387978029577277560': { label: 'Banner', type: 'بنر' },
  '1387496507816804543': { label: 'Anime', type: 'أفتار أنمي' },
};

const ROOM_OPTIONS = Object.entries(ROOM_DATA).map(([id, data]) => ({
  label: data.label,
  value: id,
}));

// 🧠 تحميل/حفظ الاستخدام
function loadUsage() {
  try {
    return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8'));
  } catch {
    return {};
  }
}
function saveUsage(data) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
}

// 🖼️ عند تنفيذ الأمر
async function handleSendImage(message) {
  const attachment = message.attachments.first();
  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return message.reply('❌ الرجاء إرفاق صورة صالحة مع الأمر.');
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select-room')
    .setPlaceholder('📁 اختر الروم لإرسال الصورة إليه')
    .addOptions(ROOM_OPTIONS);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await message.reply({
    content: '🔽 الرجاء اختيار الروم الذي تريد إرسال الصورة إليه:',
    components: [row],
  });

  const collector = message.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === message.author.id && i.customId === 'select-room',
    time: 15000,
    max: 1,
  });

  collector.on('collect', async (interaction) => {
    const selectedRoomId = interaction.values[0];
    const channel = message.guild.channels.cache.get(selectedRoomId);
    if (!channel) return interaction.reply({ content: '❌ لم يتم العثور على الروم.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setImage(attachment.url)
      .setColor('#2F3136')
      .setFooter({ text: `تم الإرسال بواسطة: ${message.author.tag}` });

    const downloadButton = new ButtonBuilder()
      .setCustomId(`senddm-${message.author.id}-${selectedRoomId}`)
      .setLabel('تحميل')
      .setEmoji('<:downloads:1387864129217364048>')
      .setStyle('Primary');

    const buttonRow = new ActionRowBuilder().addComponents(downloadButton);

    await channel.send({ embeds: [embed], components: [buttonRow] });
    await interaction.update({ content: '✅ تم إرسال الصورة بنجاح!', components: [] });
  });

  collector.on('end', (collected) => {
    if (collected.size === 0) {
      message.reply('⌛ انتهى الوقت دون اختيار روم.');
    }
  });
}

// 📩 زر التحميل: إرسال الصورة في الخاص + لوق
async function handleDMButton(interaction) {
  const [_, senderId, selectedRoomId] = interaction.customId.split('-');
  const imageUrl = interaction.message.embeds[0]?.image?.url;
  const receiver = interaction.user;

  if (!imageUrl) {
    return interaction.reply({ content: '❌ لم يتم العثور على الصورة.', ephemeral: true });
  }

  const usageData = loadUsage();
  const key = `${receiver.id}-${interaction.message.id}`;
  const now = Date.now();

  const lastUsed = usageData[key];
  if (lastUsed && now - lastUsed < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastUsed)) / 60000);
    return interaction.reply({ content: `⏳ لا يمكنك استخدام هذا الزر الآن. حاول بعد ${remaining} دقيقة.`, ephemeral: true });
  }

  try {
    // تأجيل التفاعل لإعطاء وقت للإجراء
    await interaction.deferUpdate();

    await receiver.send({ files: [imageUrl] });  // إرسال الصورة في الخاص

    usageData[key] = now;
    saveUsage(usageData);

    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle('📋 لوق تحميل تصميم من زر البوت')
        .setColor('#00B7FF')
        .addFields(
          { name: '👤 المستلم', value: `${receiver.tag} (<@${receiver.id}>)`, inline: true },
        )
        .setImage(imageUrl)
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });
    }

    // الرد بعد إتمام العملية
    await interaction.followUp({ content: '✅ تم إرسال الصورة لك في الخاص!', ephemeral: true });

  } catch {
    await interaction.followUp({ content: '❌ لا يمكنني إرسال رسالة لك في الخاص.', ephemeral: true });
  }
}

// ✅ أحداث البوت
client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(PREFIx) || message.author.bot) return;
  await handleSendImage(message);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.startsWith('senddm-')) {
    await handleDMButton(interaction);
  }
});




const PREfix = '$send-proflie';
const PROFILE_ROOM_ID = '1381752704086310952';
const sessions = new Map();

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREfix)) {
    const args = message.content.slice(PREfix.length).trim().split(/\s+/);
    if (args.length < 2 || !args[0].startsWith('#') || !args[1].startsWith('#')) {
      return message.reply('❌ يجب كتابة الأمر بهذا الشكل: `+send-proflie #HEX1 #HEX2`');
    }

    sessions.set(message.author.id, {
      hex1: args[0],
      hex2: args[1],
      step: 'awaiting_profile',
      message,
    });

    return message.reply('🖼️ أرسل الآن صورة **البروفايل**:');
  }

  const session = sessions.get(message.author.id);
  if (!session) return;

  const attachment = message.attachments.first();
  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return message.reply('❌ الرجاء إرفاق صورة صالحة.');
  }

  if (session.step === 'awaiting_profile') {
    session.profileImage = attachment.url;
    session.step = 'awaiting_avatar';
    return message.reply('🖼️ ممتاز! الآن أرسل صورة **الأفتار**:');
  }

  if (session.step === 'awaiting_avatar') {
    session.avatarImage = attachment.url;
    session.step = 'awaiting_banner';
    return message.reply('🖼️ جيد! الآن أرسل صورة **البنر**:');
  }

  if (session.step === 'awaiting_banner') {
    session.bannerImage = attachment.url;
    session.step = 'completed';

    const profileChannel = message.guild.channels.cache.get(PROFILE_ROOM_ID);
    if (!profileChannel) {
      return message.reply('❌ لم يتم العثور على روم البروفايلات.');
    }

    const embed = new EmbedBuilder()
      .setTitle('بروفايل جديد')
      .setImage(session.profileImage)
      .setColor('#2F3136')
      .setFooter({ text: `تم الإرسال بواسطة: ${message.author.tag}` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`send-profile-${message.author.id}`)
        .setLabel('تحميل')
        .setEmoji('<:downloads:1387864129217364048>')
        .setStyle(ButtonStyle.Primary)
    );

    await profileChannel.send({ embeds: [embed], components: [row] });

    await message.reply('✅ تم إرسال البروفايل بنجاح!');
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith('send-profile-')) return;

  await interaction.deferReply({ ephemeral: true }).catch(() => {});

  const userId = interaction.customId.split('-')[2];
  const session = sessions.get(userId);
  if (!session) {
    return interaction.editReply({ content: '❌ لا توجد بيانات متاحة.' }).catch(() => {});
  }

  try {
    await interaction.user.send({
      content: `🎨 **الملف الشخصي الخاص بك:**\nHEX 1: \`${session.hex1}\`\nHEX 2: \`${session.hex2}\``,
      files: [session.avatarImage, session.bannerImage],
    });

    await interaction.editReply({ content: '📬 تم إرسال الملف الشخصي إلى الخاص.' }).catch(() => {});
  } catch {
    await interaction.editReply({ content: '❌ لا يمكنني إرسال رسالة لك في الخاص.' }).catch(() => {});
  }
});


client.login(token);
