const { MessageFlags } = require('discord.js');

module.exports = {
  data: {
    name: 'test-modal',
  },
  async execute(interaction, client) {
    const userInput = interaction.fields.getTextInputValue('modal-input');

    await interaction.reply({
      content: `You entered: ${userInput}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
