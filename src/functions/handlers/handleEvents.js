const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  client.handleEvents = async () => {
    try {
      const eventsPath = path.join(__dirname, '../../events');
      const eventFolders = fs.readdirSync(eventsPath);
      const validFolders = ['client'];

      console.log('Starting to handle events...');

      for (const folder of eventFolders) {
        if (!validFolders.includes(folder)) {
          console.warn(`Skipping unknown event folder: ${folder}`);
          continue;
        }

        const folderPath = path.join(eventsPath, folder);
        const eventFiles = fs
          .readdirSync(folderPath)
          .filter((file) => file.endsWith('.js'));

        if (eventFiles.length === 0) {
          console.log(`No event files found in folder: ${folder}`);
          continue;
        }

        for (const file of eventFiles) {
          try {
            const event = require(path.join(folderPath, file));
            if (event.once) {
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
              console.log(`Event (once): ${event.name} loaded.`);
            } else {
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
              console.log(`Event: ${event.name} loaded.`);
            }
          } catch (error) {
            console.error(
              `Error loading event ${file} in folder ${folder}:`,
              error
            );
          }
        }
      }

      console.log('Successfully handled all events.');
    } catch (error) {
      console.error('Error while handling events:', error);
    }
  };
};
