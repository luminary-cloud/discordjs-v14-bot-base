require('dotenv').config();
const { token } = process.env;
const {
  Client,
  Collection,
  GatewayIntentBits,
  Options,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { connectMongo, disconnectMongo } = require('./database/connection');

if (!token) {
  throw new Error('Discord bot token is missing in environment variables.');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  makeCache: Options.cacheWithLimits({
    MessageManager: 0,
    GuildMemberManager: 0,
    UserManager: { maxSize: 100 },
  }),
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const loadFiles = (folderPath, filter) => {
  return fs.readdirSync(folderPath).filter((file) => file.endsWith(filter));
};

const initializeFunctions = async () => {
  try {
    const functionsPath = path.join(__dirname, 'functions');
    const functionFolders = fs.readdirSync(functionsPath);

    for (const folder of functionFolders) {
      const folderPath = path.join(functionsPath, folder);
      const functionFiles = loadFiles(folderPath, '.js');
      for (const file of functionFiles) {
        try {
          require(path.join(folderPath, file))(client);
        } catch (error) {
          console.error(
            `Error loading function ${file} in folder ${folder}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error('Error initializing functions:', error);
  }
};

const initializeHandlers = async () => {
  try {
    await client.handleEvents();
    await client.handleCommands();
    await client.handleComponents();
  } catch (error) {
    console.error('Error initializing handlers:', error);
  }
};

const initBot = async () => {
  try {
    await connectMongo();
  } catch (err) {
    console.error('Continuing without MongoDB due to connection error.');
  }
  await initializeFunctions();
  await initializeHandlers();
  client.login(token).catch((error) => {
    console.error('Failed to log in:', error);
  });
};

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
  try {
    await disconnectMongo();
  } finally {
    process.exit(0);
  }
});

initBot();
