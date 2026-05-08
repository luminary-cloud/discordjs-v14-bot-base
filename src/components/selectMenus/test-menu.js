const { MessageFlags } = require('discord.js');

module.exports = {
  data: {
    name: 'test-menu',
  },
  async execute(interaction, client) {
    const selectedValue = interaction.values[0];
    let response;

    switch (selectedValue) {
      case 'option-1':
        response = 'You selected Option 1.';
        break;
      case 'option-2':
        response = 'You selected Option 2.';
        break;
      default:
        response = 'Unknown selection.';
    }

    await interaction.reply({
      content: response,
      flags: MessageFlags.Ephemeral,
    });
  },
};
