const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, token, COMMANDS_SCOPE, GUILD_ID } = process.env;

module.exports = (client) => {
  client.handleCommands = async () => {
    if (!clientId || !token) {
      throw new Error(
        'clientId or token is not defined in environment variables.'
      );
    }
    const scope = (COMMANDS_SCOPE || 'global').toLowerCase();
    if (scope === 'guild' && !GUILD_ID) {
      throw new Error(
        "COMMANDS_SCOPE is 'guild' but GUILD_ID is not provided."
      );
    }
    try {
      const commandsPath = path.join(__dirname, '../../commands');
      const commandFolders = fs.readdirSync(commandsPath);
      const { commands, commandArray } = client;

      console.log('Starting to register all (/) commands...');

      for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs
          .readdirSync(folderPath)
          .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
          try {
            const command = require(path.join(folderPath, file));
            if (!command || !command.data || !command.execute) {
              console.warn(
                `Skipping invalid command export in ${file} (missing data/execute).`
              );
              continue;
            }
            commands.set(command.data.name, command);
            if (command.data instanceof SlashCommandBuilder) {
              commandArray.push(command.data.toJSON());
            } else {
              commandArray.push(command.data);
            }
            console.log(`Command: ${command.data.name} loaded.`);
          } catch (error) {
            console.error(
              `Error loading command ${file} in folder ${folder}:`,
              error
            );
          }
        }
      }

      const rest = new REST().setToken(token);

      if (scope === 'guild') {
        await rest.put(Routes.applicationGuildCommands(clientId, GUILD_ID), {
          body: client.commandArray,
        });
        console.log(
          `Successfully registered ${client.commandArray.length} (/) commands to guild ${GUILD_ID}.`
        );
      } else {
        await rest.put(Routes.applicationCommands(clientId), {
          body: client.commandArray,
        });
        console.log(
          `Successfully registered ${client.commandArray.length} (/) commands globally.`
        );
      }
    } catch (error) {
      console.error('Error while handling commands:', error);
    }
  };
};
