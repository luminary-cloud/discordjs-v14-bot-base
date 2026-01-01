Place your Mongoose models in this folder.

Example:

```js
// src/database/models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  discordId: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
```
