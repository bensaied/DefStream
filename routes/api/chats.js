const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const Mission = require("../../models/Mission");
const { check, validationResult, body } = require("express-validator");
const auth = require("../../middleware/auth");
var CryptoJS = require("crypto-js");

//////////////////////////////////////////////////////////////////////////////////// UPLOAD FILES

// Set up Multer middleware to handle file uploads
const multer = require("multer");

// Set up Multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// const upload = multer({ storage }).single("file");
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Maximum file size of 200 megabytes
}).single("file");

// Define a route to handle file uploads
router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ success: false });
    }
    const file = req.file;
    const filePath = file.path;

    res.status(200).send({ success: true, url: filePath });
  });
});

/////////////////////////////////////////////////////////////////////////////////////

//Default UploadFiles WITHOUT PROGRESSION BAR

// const multer = require("multer");
// const fs = require("fs");
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.originalname}`);
//   },
// });
// var upload = multer({ storage: storage }).single("file");

//////////////////////////////////////////////////////////////////////////////////// ADD MESSAGES TO THE CHAT DOCUMENT
router.put(
  "/message/",
  auth.token,
  //Input validation
  [
    check("username", "username is required").not().isEmpty(),
    check("text", "text is required").not().isEmpty(),
    check("time", "time is required").not().isEmpty(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, text, time, room } = req.body;

    try {
      // Search mission document by room name (name of the mission), PS: we work with room name; because in case of relaod ! we still have room name in the state.
      let mission = await Mission.findOne({ name: room });

      // See if the mission does not exist ! we get an error.
      if (!mission) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Mission does not exist." }] });
      }

      // Get ChatID from Mission document
      let chatID = mission.chat[0];
      let chatIDstr = chatID.toString();

      // Make message object and test the username
      if (username !== "DefStream Bot") {
        //Encryption of the Message's text
        var ciphertext = CryptoJS.AES.encrypt(
          text,
          chatIDstr.slice(0, 18)
        ).toString();

        let message = { username: username, text: ciphertext, time: time };

        // Push new messages in Chat document & save
        let chat = await Chat.findByIdAndUpdate(
          chatID,
          { $push: { messages: message } },
          { new: true }
        );

        await chat.save();
      }
      // Prob when we uncomment res.json(chat)
      return res.json("Message sent");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//////////////////////////////////////////////////////////////////////////////////// GET MISSION MESSAGES
router.get("/message/:mission_name", auth.token, async (req, res) => {
  //if errors then show errors message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const name = req.params.mission_name;

    // First Search for mission, and take MISSION_CHAT
    let mission = await Mission.findOne({ name });
    if (!mission) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Mission does not exist" }] });
    }

    // Find Chat of that mission
    let chat = await Chat.findById(mission.chat[0]);
    if (!chat) {
      return res.status(400).json({ errors: [{ msg: "Chat does not exist" }] });
    } else {
      let chatID = chat.id;
      let chatIDstr = chatID.toString();
      for (let i = 0; i < chat.messages.length; i++) {
        // console.log(chat.messages[i].text);
        let chatTEXT = chat.messages[i].text;

        //Decrypt Message's text
        var bytes = CryptoJS.AES.decrypt(chatTEXT, chatIDstr.slice(0, 18));
        originalText = bytes.toString(CryptoJS.enc.Utf8);
        chat.messages[i].text = originalText;
      }
      //console.log("chat.messages", chat.messages[i].text);
      res.json(chat.messages);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//////////////////////////////////////////////////////////////////////////////////// GET CHAT IP
router.get("/ip/:mission_name", auth.token, async (req, res) => {
  //if errors then show errors message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const name = req.params.mission_name;

    // First Search for the mission, and take MISSION_CHAT
    let mission = await Mission.findOne({ name });
    if (!mission) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Mission does not exist" }] });
    }

    // Find Chat of that mission
    let chat = await Chat.findById(mission.chat[0]);
    if (!chat) {
      //return res.status(400).json({ errors: [{ msg: "Chat does not exist" }] });
      res.json("localhost");
    } else {
      //  console.log("chat.ip", chat.ip);
      res.json(chat.ip);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//////////////////////////////////////////////////////////////////////////////////// POST FILES IN DISCUSSION
router.post("/uploadfiles", auth.token, async (req, res) => {
  //if errors then show errors message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    upload(req, res, (err) => {
      //console.log("res : ", res.file.originalname);
      if (err) {
        return res.json({ success: false, err });
      }
      return res.json({ success: true, url: res.req.file.path });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
