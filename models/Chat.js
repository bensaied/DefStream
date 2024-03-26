const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ip: {
    type: String,
    required: true,
  },
  messages: [
    {
      username: {
        type: String,
      },
      text: {
        type: String,
      },
      time: {
        type: String,
      },
    },
  ],
});
module.exports = chat = mongoose.model("chat", ChatSchema);
