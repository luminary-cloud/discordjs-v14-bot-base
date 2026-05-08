const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  client.handleComponents = async () => {
    try {
      const componentsPath = path.join(__dirname, '../../components');
      const componentFolders = fs.readdirSync(componentsPath);
      const { buttons, selectMenus, modals } = client;

      const folderMap = {
        buttons,
        selectMenus,
        modalMenus: modals,
      };

      console.log('Starting to handle components...');

      for (const folder of componentFolders) {
        const folderPath = path.join(componentsPath, folder);
        const componentFiles = fs
          .readdirSync(folderPath)
          .filter((file) => file.endsWith('.js'));

        if (componentFiles.length === 0) {
          console.log(`No component files found in folder: ${folder}`);
          continue;
        }

        for (const file of componentFiles) {
          try {
            const component = require(path.join(folderPath, file));
            if (folderMap[folder]) {
              folderMap[folder].set(component.data.name, component);
              console.log(
                `${folder.slice(0, -1)}: ${component.data.name} loaded.`
              );
            } else {
              console.warn(`Unknown component folder: ${folder}`);
            }
          } catch (error) {
            console.error(
              `Error loading component ${file} in folder ${folder}:`,
              error
            );
          }
        }
      }

      console.log('Successfully handled all components.');
    } catch (error) {
      console.error('Error while handling components:', error);
    }
  };
};
