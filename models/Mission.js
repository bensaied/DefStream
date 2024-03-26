const mongoose = require("mongoose");
const MissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  date: { type: Date, default: Date.now },

  broadcaster: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  status: {
    type: String,
    enum: ["Scheduled", "Live", "Rescheduled", "Canceled"],
    default: "Scheduled",
  },
  geolocalisation: {
    type: [String],
  },
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "chat" }],
});
module.exports = mission = mongoose.model("mission", MissionSchema);
