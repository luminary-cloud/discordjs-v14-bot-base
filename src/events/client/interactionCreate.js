const { MessageFlags } = require('discord.js');

const handleError = async (interaction, errorMessage) => {
  console.error(errorMessage);
  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply({
      content: `Something went wrong: ${errorMessage}`,
      flags: MessageFlags.Ephemeral,
    });
  }
};

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const { commands, buttons, selectMenus, modals } = client;

    try {
      if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      // customId schema: base:arg1:arg2:... base routes to handler, args passed through.
      if (interaction.isButton()) {
        const parts = String(interaction.customId || '').split(':');
        const buttonBaseId = parts.shift();
        const args = parts;
        const button = buttons.get(buttonBaseId);
        if (!button) return;
        interaction.customIdBase = buttonBaseId;
        interaction.customIdArgs = args;
        await button.execute(interaction, client, args);
        return;
      }

      if (interaction.isStringSelectMenu()) {
        const parts = String(interaction.customId || '').split(':');
        const menuBaseId = parts.shift();
        const args = parts;
        const menu = selectMenus.get(menuBaseId);
        if (!menu) return;
        interaction.customIdBase = menuBaseId;
        interaction.customIdArgs = args;
        await menu.execute(interaction, client, args);
        return;
      }

      if (interaction.isModalSubmit()) {
        const parts = String(interaction.customId || '').split(':');
        const modalBaseId = parts.shift();
        const args = parts;
        const modal = modals.get(modalBaseId);
        if (!modal) return;
        interaction.customIdBase = modalBaseId;
        interaction.customIdArgs = args;
        await modal.execute(interaction, client, args);
        return;
      }

      if (interaction.isContextMenuCommand()) {
        const contextCommand = commands.get(interaction.commandName);
        if (!contextCommand) return;
        await contextCommand.execute(interaction, client);
        return;
      }

      if (interaction.isAutocomplete()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;
        await command.autocomplete(interaction, client);
      }
    } catch (error) {
      await handleError(
        interaction,
        `Error processing interaction of type ${interaction.type}`
      );
    }
  },
};
