   const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
})

client.login("OTI5NDAwNTM3OTE5NjYwMDkz.Ydmxsw.bEUNyT9iqyNkSHmSNXXVGsZ1DrM");

client.on("ready", () => {
    console.log("ONLINE");
})

const { DisTube } = require("distube")
const { SpotifyPlugin } = require("@distube/spotify")
const { SoundCloudPlugin } = require("@distube/soundcloud")

const distube = new DisTube(client, {
    youtubeDL: false,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    leaveOnEmpty: true,
    leaveOnStop: true
})

client.on("messageCreate", message => {
    if (message.content.startsWith("!play")) {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        let args = message.content.split(/\s+/)
        let query = args.slice(1).join(" ")

        if (!query) {
            return message.channel.send("Inserisci la canzone che vuoi ascoltare")
        }

        distube.play(voiceChannelBot || voiceChannel, query, {
            member: message.member,
            textChannel: message.channel,
            message: message
        })
    }

    if (message.content == "!pause") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        try {
            distube.pause(message)
        } catch {
            return message.channel.send("Nessuna canzone in riproduzione o canzone già in pausa")
        }

        message.channel.send("Canzone in pausa")
    }

    if (message.content == "!resume") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("Devi essere in un canale vocale")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Qualun'altro sta già ascoltando della musica")
        }

        try {
            distube.resume(message)
        } catch {
            return message.channel.send("Nessuna canzone in riproduzione o canzone già in riproduzione")
        }

        message.channel.send("Canzone di nuovo in ascolto!")
    }
})

distube.on("addSong", (queue, song) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Canzone aggiunta!")
        .addField("Canzone", song.name)

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("playSong", (queue, song) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Canzone in riproduzione")
        .addField("Canzone", song.name)
        .addField("Richiesta da", song.user.toString())

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("searchNoResult", (message, query) => {
    message.channel.send("Canzone non trovata")
})