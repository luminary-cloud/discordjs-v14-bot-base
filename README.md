# discordjs-v14-bot-base

A Discord.js v14 starter with command, event, and component handlers. Drop in slash commands, buttons, select menus, and modals as separate files; the loader picks them up on boot.

## Quick start

1. Clone the repo.

   ```
   git clone https://github.com/luminary-cloud/discordjs-v14-bot-base.git
   cd discordjs-v14-bot-base
   ```

2. Copy the env template and fill in your bot's token and client ID from the [Discord Developer Portal](https://discord.com/developers/applications).

   ```
   cp .env.example .env
   ```

3. Install dependencies.

   ```
   npm install
   ```

4. Run the bot.

   ```
   npm run dev      # auto-reload via nodemon
   npm start        # plain node
   ```

   On first boot you'll see the command, event, and component loaders log every file they pick up, then a "Bot ready" banner.

## Configuration

All configuration lives in `.env`. `token` and `clientId` are required; everything else has a sensible default.

| Variable | Required | Default | Description |
|---|---|---|---|
| `token` | yes | | Bot token from the Developer Portal. |
| `clientId` | yes | | Application ID of your bot. |
| `COMMANDS_SCOPE` | no | `global` | `global` registers commands across every guild your bot is in. `guild` registers them only in `GUILD_ID`. |
| `GUILD_ID` | only when `COMMANDS_SCOPE=guild` | | Guild ID to register commands in. |
| `MONGO_URI` | no | | MongoDB connection string. If unset or unreachable, the bot runs without database features. |
| `NODE_ENV` | no | | `development` enables Mongoose `autoIndex`. |

Required Node version: 18 or newer.

## Project layout

```
src/
  index.js                       Entry point. Connects Mongo, loads handlers, logs in.
  commands/
    admin/                       Admin-gated slash commands (Administrator permission).
    public/                      Public slash commands.
  components/
    buttons/                     Button interaction handlers.
    selectMenus/                 String select menu handlers.
    modalMenus/                  Modal submit handlers.
  events/
    client/                      discord.js client events. Drop new events here.
  functions/
    handlers/                    Loader code: handleCommands, handleEvents, handleComponents.
  database/
    connection.js                Mongoose connect/disconnect wrappers.
    models/                      Mongoose schemas.
```

The loader is flat-per-folder. Each handler reads its directory, requires every `.js` file, and registers the export. Subfolders inside `commands/`, `components/`, or `events/` other than the categories above are not traversed.

## Adding a slash command

Drop a file in `src/commands/public/` (or `admin/` for admin-only):

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong'),
  async execute(interaction, client) {
    await interaction.reply('Pong.');
  },
};
```

Restart the bot (or save while `npm run dev` is running). The loader picks it up and registers it with Discord on boot.

## Adding a button, select menu, or modal

Two pieces: the slash command that produces the component, and the handler file that responds to it.

The handler file goes in `src/components/buttons/`, `selectMenus/`, or `modalMenus/`. It exports `data.name` and `execute`:

```js
const { MessageFlags } = require('discord.js');

module.exports = {
  data: { name: 'my-button' },
  async execute(interaction, client, args) {
    await interaction.reply({
      content: 'Clicked.',
      flags: MessageFlags.Ephemeral,
    });
  },
};
```

In the slash command that builds the component, set `customId` to match `data.name`. See `src/commands/admin/testbuttons.js` for a wired-up example.

### Custom ID routing

`interactionCreate.js` parses every component `customId` as `base:arg1:arg2:...`. The base routes to the handler with the matching `data.name`; the args become the third parameter of `execute` and are also attached to `interaction.customIdArgs`.

Example: a button with `customId = 'my-button:42:foo'` invokes the `my-button` handler with `args = ['42', 'foo']`. Useful for parameterizing handlers without a separate state map.

## MongoDB

Optional. Set `MONGO_URI` and the bot connects on boot. If the connection fails, the bot logs the error and keeps running without database features.

Mongoose schemas go in `src/database/models/`. A minimal example:

```js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  discordId: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
```

`autoIndex` is on when `NODE_ENV=development` and off otherwise.

## Why guild vs global commands

Discord caches global slash command definitions for up to an hour, so changes don't show up in the client immediately. Guild-scoped commands update instantly.

Use `COMMANDS_SCOPE=guild` with a test `GUILD_ID` while iterating, then switch to `global` for production. The handler picks the right `Routes` endpoint at boot (`applicationGuildCommands` or `applicationCommands`).

## License

[MIT](LICENSE).
