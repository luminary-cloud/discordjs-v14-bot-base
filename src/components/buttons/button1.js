const { MessageFlags } = require('discord.js');

module.exports = {
  data: {
    name: 'button1',
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: 'You pressed Button 1.',
      flags: MessageFlags.Ephemeral,
    });
  },
};
