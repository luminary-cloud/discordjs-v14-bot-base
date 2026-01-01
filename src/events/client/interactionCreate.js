const { MessageFlags } = require('discord.js');

// Helper function to handle errors and reply to the user if possible
const handleError = async (interaction, errorMessage) => {
  console.error(errorMessage);
  // Only reply if the interaction hasn't already been replied to or deferred
  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply({
      content: `Something went wrong: ${errorMessage}`,
      flags: MessageFlags.Ephemeral,
    });
  }
};

module.exports = {
  name: 'interactionCreate',
  // Main event handler for all types of interactions
  async execute(interaction, client) {
    // Destructure collections from the client for easier access
    const { commands, buttons, selectMenus, modals } = client;

    try {
      // Ensure the guild is cached (important for multi-guild support)
      if (interaction.guild && !client.guilds.cache.has(interaction.guild.id)) {
        await client.guilds.fetch(interaction.guild.id).catch(() => {});
      }

      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      // Handle button interactions
      if (interaction.isButton()) {
        // Parse payload in customId: base:arg1:arg2:...
        const parts = String(interaction.customId || '').split(':');
        const buttonBaseId = parts.shift();
        const args = parts;
        const button = buttons.get(buttonBaseId);
        if (!button) return;
        // Attach parsed info for convenience
        interaction.customIdBase = buttonBaseId;
        interaction.customIdArgs = args;
        await button.execute(interaction, client, args);
        return;
      }

      // Handle select menu interactions
      if (interaction.isStringSelectMenu()) {
        // Parse payload in customId
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

      // Handle modal submit interactions
      if (interaction.isModalSubmit()) {
        // Parse payload in customId
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

      // Handle context menu commands (user/message right-click)
      if (interaction.isContextMenuCommand()) {
        const contextCommand = commands.get(interaction.commandName);
        if (!contextCommand) return;
        await contextCommand.execute(interaction, client);
        return;
      }

      // Handle autocomplete interactions for slash commands
      if (interaction.isAutocomplete()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;
        await command.autocomplete(interaction, client);
      }
    } catch (error) {
      // Catch any errors and handle them gracefully
      await handleError(
        interaction,
        `Error processing interaction of type ${interaction.type}`
      );
    }
  },
};
