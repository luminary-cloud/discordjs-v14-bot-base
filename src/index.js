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

// Check if the Discord bot token is provided in environment variables
if (!token) {
  throw new Error('Discord bot token is missing in environment variables.');
}

// Create a new Discord client instance with required intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  makeCache: Options.cacheWithLimits({
    MessageManager: 0,
    GuildMemberManager: 0,
    // Keep a small user cache to avoid repeated fetches for interactions
    UserManager: { maxSize: 100 },
  }),
});

// Initialize collections for commands and components
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

// Utility function to load files with a specific extension from a folder
const loadFiles = (folderPath, filter) => {
  return fs.readdirSync(folderPath).filter((file) => file.endsWith(filter));
};

// Dynamically load all function files from the functions directory
const initializeFunctions = async () => {
  try {
    const functionsPath = path.join(__dirname, 'functions');
    const functionFolders = fs.readdirSync(functionsPath);

    for (const folder of functionFolders) {
      const folderPath = path.join(functionsPath, folder);
      const functionFiles = loadFiles(folderPath, '.js');
      for (const file of functionFiles) {
        try {
          // Require and execute each function file, passing the client
          require(path.join(folderPath, file))(client);
        } catch (error) {
          // Log errors that occur while loading a function
          console.error(
            `Error loading function ${file} in folder ${folder}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    // Log errors that occur during function initialization
    console.error('Error initializing functions:', error);
  }
};

// Initialize all handlers (events, commands, components)
const initializeHandlers = async () => {
  try {
    await client.handleEvents();
    await client.handleCommands();
    await client.handleComponents();
  } catch (error) {
    // Log errors that occur during handler initialization
    console.error('Error initializing handlers:', error);
  }
};

// Main bot initialization function
const initBot = async () => {
  // Connect to MongoDB first so models are ready before events/commands
  try {
    await connectMongo();
  } catch (err) {
    console.error('Continuing without MongoDB due to connection error.');
  }
  await initializeFunctions();
  await initializeHandlers();
  // Log in to Discord with the provided token
  client.login(token).catch((error) => {
    console.error('Failed to log in:', error);
  });
};

// Handle uncaught exceptions to prevent the bot from crashing silently
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error:', err);
});

// Handle unhandled promise rejections for better error visibility
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown for MongoDB and Discord
process.on('SIGINT', async () => {
  try {
    await disconnectMongo();
  } finally {
    process.exit(0);
  }
});

// Start the bot
initBot();
