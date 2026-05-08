const { MessageFlags } = require('discord.js');

module.exports = {
  data: {
    name: 'button2',
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: 'You pressed Button 2.',
      flags: MessageFlags.Ephemeral,
    });
  },
};
