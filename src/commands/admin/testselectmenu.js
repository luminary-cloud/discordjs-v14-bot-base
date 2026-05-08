const {
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testselectmenu')
    .setDescription('Returns a select menu test message.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const select = new StringSelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Choose an option')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Option 1')
          .setValue('option-1'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Option 2')
          .setValue('option-2')
      );

    const embed = new EmbedBuilder()
      .setTitle('Select Menus')
      .setDescription('Click an option below to see its response.')
      .setColor('#AA336A');

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
