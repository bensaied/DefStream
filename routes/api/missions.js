const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Mission = require("../../models/Mission");
const auth = require("../../middleware/auth");
const missionLog = require("../../logger/index");
const Chat = require("../../models/Chat");
const { exec } = require("child_process");
const formidable = require("formidable");
const fs = require("fs");
/**
 * @route   POST api/missions
 * @desc    add new mission
 *@access  only admin
 */
/////////////////////////////////////////////////////////////////////////////////// ADD NEW MISSION
router.post(
  "/",
  auth.token,
  //Input validation
  [
    check("status", "Status is required.").not().isEmpty(),
    check("allowedUsers", "Please choose at least one user.").not().isEmpty(),
    check("broadcaster", "Please choose a broadcaster.").not().isEmpty(),
    check("date", "Date is required.").not().isEmpty(),
    check("name", "Mission name is required.").not().isEmpty(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      description,
      broadcaster,
      status,
      image,
      date,
      geolocalisation,
      allowedUsers,
    } = req.body;

    try {
      //See if admin
      const admin = await User.findById(req.user.id).select("userType");

      if (!admin || admin.userType != "admin") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Only Admin can add mission." }] });
      }

      let mission = await Mission.findOne({ name });
      if (mission) {
        return res.status(400).json({
          errors: [{ msg: "Mission with this Name already exists." }],
        });
      }
      mission = {};
      mission.name = name;
      if (status) {
        const types = ["Complete", "IsLive", "Scheduled"];
        if (!types.includes(status)) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid mission status" }] });
        }
        mission.status = status;
      }
      if (description) mission.description = description;

      if (image) {
        mission.image = image;
      }

      //mission.chat= req.body.name;

      a = date.slice(0, 4);
      b = Date(Date.now()).slice(11, 15);

      c = date.slice(5, 7);
      today = new Date();
      d = Number(today.toLocaleDateString("en-US", { month: "numeric" }));

      e = date.slice(8, 10);
      f = Date(Date.now()).slice(8, 10);

      g = date.slice(11, 13);
      h = Date(Date.now()).slice(16, 18);

      i = date.slice(14, 17);
      j = Date(Date.now()).slice(19, 21);

      if (a > b) {
        mission.date = date;
      } else if (a >= b && c > d) {
        mission.date = date;
      } else if (a >= b && c >= d && e > f) {
        mission.date = date;
      } else if (a >= b && c >= d && e >= f && g > h) {
        mission.date = date;
      } else if (a >= b && c >= d && e >= f && g >= h && i > j) {
        mission.date = date;
      } else {
        return res.status(400).json({
          errors: [{ msg: "Date of mission can not be in the past." }],
        });
      }

      if (broadcaster) mission.broadcaster = broadcaster;
      if (allowedUsers) {
        user = await User.findOne({ name: allowedUsers[0] });
        if (user) {
          mission.allowedUsers = user;
        }
      }
      if (geolocalisation) mission.geolocalisation = geolocalisation;

      // Create Chat document with default ip address (localhost)

      const chat = new Chat();
      chat.ip = "127.0.0.1";
      await chat.save();
      // Save chatID in the mission document
      mission.chat = chat.id;
      // Save the mission document
      const misssion = new Mission(mission);
      await misssion.save();

      if (allowedUsers.length > 1) {
        for (i = 1; i < allowedUsers.length; i++) {
          user = await User.findOne({ name: allowedUsers[i] });
          if (user) {
            mission = await Mission.findOne({ name: req.body.name });

            mission = await Mission.findByIdAndUpdate(
              mission._id,
              { $push: { allowedUsers: user } },
              { new: true }
            );
          }
        }
      }
      user = await User.findByIdAndUpdate(
        broadcaster._id,
        { $set: { allowedMissions: misssion.id } },
        { new: true }
      );
      for (j = 0; j < allowedUsers.length; j++) {
        user = await User.findOne({ name: allowedUsers[j] });
        if (user) {
          user = await User.findByIdAndUpdate(
            user._id,
            { $push: { allowedMissions: misssion.id } },
            { new: true }
          );
        }
      }

      res.json("Mission Added");

      ///////////////////////////////////////////////////////////////////////LOG
      missionLog.info("Admin add new mission!", {
        MissionName: `${mission.name}`,
        Broadcaster: `${broadcaster.name}`,
        AllowedUsers: `${req.body.allowedUsers}`,
        Date: `${req.body.date}`,
        Localization: `${req.body.geolocalisation}`,
        Description: `${mission.description}`,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

////////////////////////////////////////////////////////////////////////////////// GET ALL MISIONS
router.get("/all", auth.token, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("userType");
    // if (user.userType == 'admin')
    {
      const mission = await Mission.find()
        .lean()
        .populate("broadcaster", "name")
        .populate("allowedUsers");
      if (!mission) return res.status(400).json({ msg: "There is no mission" });
      else {
        for (i = 0; i < mission.length; i++) {
          mission[i].broadcaster = Object.values(
            Object.values(mission[i].broadcaster)[0]
          )[1];
        }
        for (i = 0; i < mission.length; i++) {
          table = [];
          table[i] = mission[i].allowedUsers;
          let res = table[i].map(({ name }) => name);
          mission[i].allowedUsers = res;
        }
        res.json(mission);
      }
    }
    // else { return res.status(200).json({ msg: "Unauthorized operation!" });}
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no mission" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/missions/update/:id
// @desc    UPDATE mission
// @access  only admin
//////////////////////////////////////////////////////////////////////////////////// EDIT MISSION
router.put(
  "/edit",
  auth.token,
  [
    check("name", "Name is required.").not().isEmpty(),
    check("date", "Date is required.").not().isEmpty(),
    check("status", "Status is required.").not().isEmpty(),
    check("broadcaster", "Please set a broadcaster.").not().isEmpty(),
    check("allowedUsers", "Please set at least one user.").not().isEmpty(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      _id,
      name,
      /*description, image,*/ status,
      date,
      broadcaster,
      allowedUsers,
      geolocalisation,
      chat,
    } = req.body;

    try {
      //////////// Only ADMIN CAN EDIT MISSIONS
      const admin = await User.findById(req.user.id).select("userType");

      if (!admin || admin.userType != "admin") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Only Admin can edit missions." }] });
      }

      //////////// See if MISSION exists
      const id = req.body._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          errors: [
            {
              msg: "Mission does not exist",
            },
          ],
        });
      }
      // See if mission exists
      let mission = await Mission.findById(id).select("id");
      if (!mission) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Mission does not exists" }] });
      }

      mission = {};
      if (name) {
        let mission1 = await Mission.findOne({ name: req.body.name });
        if (mission1 && mission1._id != id) {
          return res.status(400).json({
            errors: [{ msg: "Mission with this Name already exists." }],
          });
        }

        mission.name = name;
      }

      //////////////////////////////////////////////////////////Mission Status
      if (status) {
        const types = [
          "Scheduled",
          "Live",
          "Complete",
          "Rescheduled",
          "Canceled",
        ];
        if (!types.includes(status)) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid mission status" }] });
        }

        if (status == "Canceled") {
          // Remove mission id from users profiles
          if (mission) {
            user = await User.updateMany(
              { allowedMissions: id },
              { $pull: { allowedMissions: id } }
            );
          }

          // Remove chat document
          await Chat.findOneAndRemove({ _id: chat[0] });
          // Remove mission
          await Mission.findOneAndRemove({ _id: id });
          res.json({ msg: "Mission deleted" });
        } else if (status == "Live") {
          mission.status = status;
        } else {
          a = date.slice(0, 4);
          b = Date(Date.now()).slice(11, 15);

          c = date.slice(5, 7);
          today = new Date();
          d = Number(today.toLocaleDateString("en-US", { month: "numeric" }));

          e = date.slice(8, 10);
          f = Date(Date.now()).slice(8, 10);

          g = date.slice(11, 13);

          h = Date(Date.now()).slice(16, 18);

          i = date.slice(14, 16);
          j = Date(Date.now()).slice(19, 21);

          if (a > b) {
            mission.date = date;
            mission.status = status;
          } else if (a >= b && c > d) {
            mission.date = date;
            mission.status = status;
          } else if (a >= b && c >= d && e > f) {
            mission.date = date;
            mission.status = status;
          } else if (a >= b && c >= d && e >= f && g > h) {
            mission.date = date;
            mission.status = status;
          } else if (a >= b && c >= d && e >= f && g >= h && i > j) {
            mission.date = date;
            mission.status = status;
          } else {
            return res.status(400).json({
              errors: [{ msg: "Date of mission can not be in the past." }],
            });
          }
        }
      }

      if (broadcaster) {
        ///////////////////Verify if this Broadcaster is available
        user = await User.findOne({ name: broadcaster });
        if (user && user.allowedMissions != id && user.allowedMissions != "") {
          return res
            .status(400)
            .json({ errors: [{ msg: "This Broadcaster is not available." }] });
        }

        /////////////////Update Own Mission Broadcaster
        user = await User.findOne({ name: broadcaster });
        if (user) {
          mission.broadcaster = user;
        }
        /////////////////Update Broadcaster Profile of this Mission
        if (mission) {
          user = await User.updateMany(
            { allowedMissions: id },
            { $set: { allowedMissions: [] } }
          );
        }

        user = await User.findOne({ name: broadcaster });

        /////////////////Update Broadcaster Profile of this Mission
        if (user) {
          user = await User.findByIdAndUpdate(
            user._id,
            { $set: { allowedMissions: id } },
            { new: true }
          );
        }
      }

      if (allowedUsers) {
        for (i = 0; i < req.body.allowedUsers.length; i++) {
          user = await User.find({ name: req.body.allowedUsers });

          if (user) {
            user = await User.updateMany(
              { name: req.body.allowedUsers },
              { $addToSet: { allowedMissions: id } }
            );
          }
        }

        for (j = 0; j < req.body.allowedUsers.length; j++) {
          user = await User.find({ name: req.body.allowedUsers });

          if (user) {
            let res = user.map(({ _id }) => _id);
            mission.allowedUsers = res;
          }
        }
      }

      if (geolocalisation) mission.geolocalisation = geolocalisation;

      ///////////////////////////////////////////////////////////////////////LOG
      missionLog.info("Admin update a mission!", {
        MissionName: `${mission.name}`,
        Status: `${req.body.status}`,
        Broadcaster: `${req.body.broadcaster}`,
        AllowedUsers: `${req.body.allowedUsers}`,
        Date: `${mission.date}`,
        Localization: `${req.body.geolocalisation}`,
        //Description: `${mission.description}`,
      });

      mission = await Mission.findByIdAndUpdate(
        id,
        {
          $set: mission,
        },
        {
          new: true,
        }
      );
      return res.json(mission);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////// Remove Mission
// @desc    DELETE mission
// @access  only admin
router.delete("/delete/:id", auth.token, async (req, res) => {
  try {
    // only admin can delete missions
    const admin = await User.findById(req.user.id).select("userType");
    if (!admin && admin.userType != "admin") {
      return res.status(400).json({
        errors: [{ msg: "Only admin can delete missions." }],
      });
    }
    // See if mission id is valid
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Mission does not exist",
          },
        ],
      });
    }
    // See if mission exists
    let mission = await Mission.findById(id).select("chat");
    if (!mission) {
      return res.status(400).json({
        errors: [
          {
            msg: "Mission does not exist",
          },
        ],
      });
    }

    user = await User.updateMany(
      { allowedMissions: id },
      { $pull: { allowedMissions: id } }
    );
    // Remove chat document
    await Chat.findOneAndRemove({ _id: mission.chat[0] });
    res.json({ msg: "Chat deleted" });
    // Remove mission
    await Mission.findOneAndRemove({ _id: id });
    res.json({ msg: "Mission deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/missions/autoChange
// @desc    UPDATE mission
//////////////////////////////////////////////////////////////////////////////////// CHANGE STATUS
router.put("/autoChange", auth.token, async (req, res) => {
  const { missions } = req.body;

  try {
    //See if admin
    //  const admin = await User.findById(req.user.id).select('userType');
    //  if (!admin || admin.userType != 'admin') {
    //    return res
    //      .status(400)
    //      .json({ errors: [{ msg: 'Only Admin can reload the status of missions.' }] });
    //    }
    //////////// Make an array of Missions Ids and an array of Missions dates
    const id = [];
    const dates = [];
    //////////// Arrays of Dates Variables
    const a = [];
    const b = [];
    const c = [];
    const d = [];
    const e = [];
    const f = [];
    const g = [];
    const h = [];
    const i = [];
    const j = [];
    today = new Date();

    for (var k = 0; k < req.body.missions.length; k++) {
      id[k] = req.body.missions[k]._id;
      dates[k] = req.body.missions[k].date;
    }
    for (var l = 0; l < req.body.missions.length; l++) {
      a[l] = Number(dates[l].slice(0, 4));
      b[l] = Number(Date(Date.now()).slice(11, 15));
      c[l] = Number(dates[l].slice(5, 7));
      d[l] = Number(today.toLocaleDateString("en-US", { month: "numeric" }));
      e[l] = Number(dates[l].slice(8, 10));
      f[l] = Number(Date(Date.now()).slice(8, 10));
      g[l] = Number(dates[l].slice(11, 13)) + 1;
      if (g[l] == 24) {
        g[l] = 0;
      }
      if (g[l] == 0) {
        e[l] = e[l] + 1;
      }
      h[l] = Number(Date(Date.now()).slice(16, 18));
      i[l] = Number(dates[l].slice(14, 16));
      j[l] = Number(Date(Date.now()).slice(19, 21));
    }

    for (var m = 0; m < req.body.missions.length; m++) {
      if (
        ((req.body.missions[m].status == "Scheduled" ||
          req.body.missions[m].status == "Rescheduled") &&
          a[m] < b[m]) ||
        ((req.body.missions[m].status == "Scheduled" ||
          req.body.missions[m].status == "Rescheduled") &&
          a[m] == b[m] &&
          c[m] < d[m]) ||
        ((req.body.missions[m].status == "Scheduled" ||
          req.body.missions[m].status == "Rescheduled") &&
          a[m] == b[m] &&
          c[m] == d[m] &&
          e[m] < f[m]) ||
        ((req.body.missions[m].status == "Scheduled" ||
          req.body.missions[m].status == "Rescheduled") &&
          a[m] == b[m] &&
          c[m] == d[m] &&
          e[m] == f[m] &&
          g[m] < h[m]) ||
        ((req.body.missions[m].status == "Scheduled" ||
          req.body.missions[m].status == "Rescheduled") &&
          a[m] == b[m] &&
          c[m] == d[m] &&
          e[m] == f[m] &&
          g[m] == h[m] &&
          i[m] <= j[m])
      ) {
        let mission = await Mission.findById(req.body.missions[m]._id);

        mission = await Mission.findByIdAndUpdate(
          id[m],
          {
            $set: { status: "Live" },
          },
          {
            new: true,
          }
        );
        console.log("Mission updated:", mission);
        if (mission) {
          return res.json(mission);
        }
      }
    }
    res.json("This is end");
    console.log("End of checking missions's date");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//////////////////////////////////////////////////////////GET USB DEVICES Linux

// GETING USB DEVICES WHICH MOUNTED ONLY ON /media on LINUX
// router.get("/usb-devices", function (req, res) {
//   const { spawn } = require("child_process");
//   const { exec } = require("child_process");
//   const lsblk = spawn("lsblk", ["-o", "NAME,SIZE,TYPE,MOUNTPOINT"]);

//   exec("lsblk -Po NAME,SIZE,TYPE,MOUNTPOINT", (error, stdout, stderr) => {
//     if (error) {
//       console.log(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//     }
//     const output = stdout.toString().split("\n");
//     const driveNames = [];

//     for (let i = 0; i < output.length; i++) {
//       const parts = output[i].split(" ");
//       if (parts.length !== 4) {
//         continue;
//       }
//       const [name, size, type, mountpoint] = parts;

//       if (mountpoint.startsWith('MOUNTPOINT="/media')) {
//         const deviceName = mountpoint.slice(
//           mountpoint.lastIndexOf("/") + 1,
//           mountpoint.length - 1
//         );
//         driveNames.push(deviceName);
//       }
//     }
//     res.json(driveNames);
//   });

//   lsblk.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//     res.status(500).json({ error: "Error finding USB devices" });
//   });

//   lsblk.on("close", (code) => {
//     console.log(`lsblk exited with code ${code}`);
//   });
// });

//////////////////////////////////////////////////////////GET USB DEVICES Windows

// GETING USB DEVICES WHICH MOUNTED ONLY ON /media on Windows
router.get("/usb-devices", (req, res) => {
  exec(
    "wmic diskdrive get DeviceID,Size,MediaType",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: "Error finding USB devices" });
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        res.status(500).json({ error: "Error finding USB devices" });
        return;
      }
      const lines = stdout.trim().split("\r\r\n");
      const usbDevices = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s{2,}/);
        const deviceID = parts[0];
        const size = parts[1];
        const mediaType = parts[2];

        if (mediaType === "USB") {
          const deviceName = deviceID.split("\\").pop();
          usbDevices.push(deviceName);
        }
      }

      res.json(usbDevices);
    }
  );
});

////////////////////////////////////////////////////////// SAVE THE RECORDED VIDEO TO A USB STORAGE DEVICE On Linux
// router.post("/save-recorded-video", function (req, res) {
//   const formidable = require("formidable");
//   const fs = require("fs");

//   const form = new formidable.IncomingForm();
//   form.parse(req, function (err, fields, files) {
//     const selectedDevice = fields.selectedDevice;
//     const mission = fields.mission;
//     if (!selectedDevice) {
//       console.log("USB storage device not found.");
//       res.status(400).send("USB storage device not found.");
//       return;
//     }

//     // Get the file path of USB device
//     const { spawn } = require("child_process");
//     const { exec } = require("child_process");
//     exec("lsblk -Po NAME,SIZE,TYPE,MOUNTPOINT", (error, stdout, stderr) => {
//       if (error) {
//         console.log(`Error: ${error.message}`);
//         res
//           .status(500)
//           .send("Error retrieving USB storage device information.");
//         return;
//       }
//       if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         res
//           .status(500)
//           .send("Error retrieving USB storage device information.");
//         return;
//       }
//       const output = stdout.toString().split("\n");

//       for (let i = 0; i < output.length; i++) {
//         const parts = output[i].split(" ");
//         if (parts.length !== 4) {
//           continue;
//         }
//         const [name, size, type, mountpoint] = parts;

//         if (mountpoint.startsWith('MOUNTPOINT="/media')) {
//           const mediaIndex = mountpoint.indexOf("/media/");
//           const devicePath = mountpoint.substring(
//             mediaIndex,
//             mountpoint.indexOf("/", mediaIndex + 8) + 1
//           );
//           // Get Current date (year, month, day, hours and minutes)
//           let currentDate = new Date();
//           const year = currentDate.getFullYear();
//           const month = currentDate.getMonth() + 1;
//           const day = currentDate.getDate();
//           const hours = currentDate.getHours();
//           const minutes = currentDate.getMinutes();
//           const seconds = currentDate.getSeconds();

//           const filename = `${mission}-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.mp4`;
//           const filepath = `${devicePath}${selectedDevice}/${filename}`;

//           // Create read stream from recorded video file
//           const stream = fs.createReadStream(files.recordedVideoData.filepath);

//           // Pipe the stream to the USB storage device
//           stream
//             .pipe(fs.createWriteStream(filepath))
//             .on("error", function (error) {
//               console.log("Error saving file:", error);
//               res.status(500).send("Error saving file to USB storage device.");
//               return;
//             })
//             .on("finish", function () {
//               console.log("File saved to USB storage device.");
//               res.send("File saved to USB storage device.");
//             });
//         }
//       }
//     });
//   });
// });
////////////////////////////////////////////////////////// SAVE THE RECORDED VIDEO TO A USB STORAGE DEVICE On Windows

router.post("/save-recorded-video", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    const selectedDevice = fields.selectedDevice;
    const mission = fields.mission;

    if (!selectedDevice) {
      console.log("USB storage device not found.");
      res.status(400).send("USB storage device not found.");
      return;
    }

    // Use wmic to get the drive letter of the USB storage device
    exec(
      "wmic logicaldisk get deviceid,volumename",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          res
            .status(500)
            .send("Error retrieving USB storage device information.");
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          res
            .status(500)
            .send("Error retrieving USB storage device information.");
          return;
        }

        const lines = stdout.trim().split("\r\r\n");
        let usbDrivePath = "";

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].trim().split(/\s{2,}/);
          const driveLetter = parts[0].trim();
          const volumeName = parts[1].trim();

          if (volumeName === selectedDevice) {
            usbDrivePath = driveLetter;
            break;
          }
        }

        if (!usbDrivePath) {
          console.log("USB storage device not found.");
          res.status(400).send("USB storage device not found.");
          return;
        }

        // Get Current date (year, month, day, hours, minutes, and seconds)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const day = ("0" + currentDate.getDate()).slice(-2);
        const hours = ("0" + currentDate.getHours()).slice(-2);
        const minutes = ("0" + currentDate.getMinutes()).slice(-2);
        const seconds = ("0" + currentDate.getSeconds()).slice(-2);

        const filename = `${mission}-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.mp4`;
        const filepath = `${usbDrivePath}\\${filename}`;

        // Create read stream from recorded video file
        const stream = fs.createReadStream(files.recordedVideoData.path);

        // Pipe the stream to the USB storage device
        stream
          .pipe(fs.createWriteStream(filepath))
          .on("error", (error) => {
            console.error("Error saving file:", error);
            res.status(500).send("Error saving file to USB storage device.");
          })
          .on("finish", () => {
            console.log("File saved to USB storage device.");
            res.send("File saved to USB storage device.");
          });
      }
    );
  });
});
module.exports = router;

///////////////////////////////////////////////////////////////////////////// NOT USED IN THE APP

// @route   Get api/missions/all
// @desc    get all missions
// @access  only admin
// router.get("/all", auth.token, async (req, res) => {
//   try {
//     const admin = await User.findById(req.user.id).select("userType");
//     if (admin.userType != "admin") {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: "Unauthorized operation" }] });
//     }
//     const missions = await Mission.find().populate("broadcaster", ["name"]);
//     if (!missions) return res.status(400).json({ msg: "There is no mission" });
//     res.json(missions);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind == "ObjectId") {
//       return res.status(400).json({ msg: "There is no mission" });
//     }
//     res.status(500).send("Server Error");
//   }
// });

///////////////////////////////////////////////////////////////////////////// NOT USED IN THE APP

// @route   Get api/mission/fetch/:missionid
// @desc    get mission informations by mission id
// @access  only admin
// router.get("/fetch/:missionid", auth.token, async (req, res) => {
//   try {
//     const admin = await User.findById(req.user.id).select("userType");
//     if (admin.userType != "admin") {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: "Unauthorized operation" }] });
//     }
//     // See if mission exists
//     const id = req.params.missionid;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         errors: [
//           {
//             msg: "Mission does not exist",
//           },
//         ],
//       });
//     }
//     let mission = await Mission.findById(id).populate("broadcaster", ["name"]);
//     if (!mission) {
//       return res.status(400).json({
//         errors: [
//           {
//             msg: "Mission does not exist",
//           },
//         ],
//       });
//     }
//     return res.json(mission);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });
