const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  firstConnect: {
    type: Boolean,
    default: true,
  },
  // usb: {
  //   secret: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },
  //   productId: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },
  // },
  userType: {
    type: String,
    enum: ["user", "admin", "broadcaster"],
    default: "user",
  },
  location: {
    type: String,
    required: false,
  },
  allowedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "mission" }],
});

module.exports = User = mongoose.model("user", UserSchema);
