module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    const divider = '='.repeat(48);

    console.log(`\n${divider}`);
    console.log(`${client.user.tag} is online`);
    console.log(`Serving ${client.guilds.cache.size} server(s)`);
    console.log(divider);

    if (client.guilds.cache.size > 0) {
      console.log('Guilds:');
      for (const [guildId, guild] of client.guilds.cache) {
        let memberCount = 'unknown';
        try {
          const fetchedGuild = await client.guilds.fetch(guildId);
          memberCount = fetchedGuild.memberCount || 'unknown';
        } catch {}
        console.log(`  - ${guild.name} [${guild.id}] ${memberCount} members`);
      }
    } else {
      console.log('No guilds found.');
    }

    console.log(divider);
    console.log('Bot ready');
    console.log(`${divider}\n`);
  },
};
