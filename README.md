# Discord.js v14 Bot Base

A simple, easy-to-use bot base for building **Discord Bots** with [Discord.js v14](https://discord.js.org/).

This template comes with ready-to-use **command**, **event**, and **component handlers**, allowing you to easily create a bot that supports:

- 🟢 Slash Commands
- 🟦 Buttons
- 🟣 Select Menus
- 🟡 Autocompletion
- 🟠 Modals

The modular structure of this base makes it easy to extend with your own custom features!

---

## ✨ Features

- **Slash Commands**: Easily register and manage your bot’s commands.
- **Buttons**: Implement interactive buttons in your bot’s messages.
- **Select Menus**: Add select menus for better user interaction.
- **Modals**: Display modals for custom inputs.
- **Autocompletion**: Provide users with dynamic command suggestions.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/minuscloud/discordjs-v14-bot-base.git
cd discordjs-v14-bot-base
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# .env
token=YOUR_BOT_TOKEN
clientId=YOUR_APPLICATION_CLIENT_ID
COMMANDS_SCOPE=global
# If using guild scope, set:
# GUILD_ID=YOUR_GUILD_ID

# MongoDB connection
MONGO_URI=mongodb://localhost:27017/discord-bot
NODE_ENV=development
```

You can find `token` and `clientId` in the [Discord Developer Portal](https://discord.com/developers/applications). Set `COMMANDS_SCOPE` to `guild` during development to avoid global registration delays; switch to `global` for production.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Bot

````bash
npm start

For development with auto-reload:

```bash
npm run dev
````

> Note: When `COMMANDS_SCOPE=global`, registering commands can take up to an hour to propagate. Use `guild` scope for faster iteration.

---

## 🗃️ MongoDB Setup

This base includes a minimal MongoDB setup using **Mongoose**.

- Connection code: `src/database/connection.js`
- Models folder: `src/database/models`

Create your models in `src/database/models`:

```js
// src/database/models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  discordId: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
```

MongoDB connection is initialized before the bot logs in. If MongoDB is unavailable, the bot will continue to run but log the connection error.

```

---

## 🛠️ Project Structure

```

src/
commands/ # Slash command files
components/ # Buttons, select menus, modals
events/ # Event handlers
functions/ # Handler logic
index.js # Bot entry point
.env # Environment variables

```

---

## 📝 Contributing

Contributions are always welcome!
If you have suggestions, feature requests, or bug fixes, feel free to open an [issue](https://github.com/minuscloud/discordjs-v14-bot-base/issues) or a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Made with ❤️ by cloud

```
