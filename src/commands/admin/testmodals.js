const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testmodals')
    .setDescription('Returns a modal test message')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId('test-modal')
      .setTitle('Test Modal');

    const input = new TextInputBuilder()
      .setCustomId('modal-input')
      .setLabel('Enter some text')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(input);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  },
};
