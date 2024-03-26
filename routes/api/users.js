const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWTSECRET } = require("../../config/config");
const User = require("../../models/User");
const Chat = require("../../models/Chat");
const Mission = require("../../models/Mission");
const auth = require("../../middleware/auth");
const userLog = require("../../logger/index");
const crypto = require("crypto");
const { log } = require("console");

///////////////////////////////////////////////////////////////////////////////////AuthToken
// @route   Get api/users/auth
// @desc    Get current user by Token
// @access  Public
router.get("/auth", auth.token, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("allowedMissions", ["-allowedUsers"]);
    res.json(user);
  } catch (err) {
    console.log(err.msg);
    res.status(500).send("server error");
  }
});

///////////////////////////////////////////////////////////////////////////////////Log IN 1
// @route  api/users/auth
// @desc   Login 1 user
// @access Public
// router.post(
//   "/auth",
//   //Input validation
//   [
//     check("productId", "Please include a product id").not().isEmpty(),
//     check("secret", "A key is required").not().isEmpty(),
//   ],
//   async (req, res) => {
//     //if errors then show errors message
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { productId, secret } = req.body;
//     console.log("This is the user credentials to log in:", productId + secret);
//     console.log(typeof productId);

//     try {
//       //See if the user exists
//       let user = await User.findOne({ "usb.productId": productId.toString() });
//       const usb = await user.usb;
//       const isValid = usb.secret == secret;
//       if (!user || !isValid) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: "Invalid credentials." }] });
//       }

//       const payload = {
//         id: user.id,
//       };
//       res.json(payload);
//       ///////////////////////////////////////////////////////////////////////LOG LOGIN 1
//       userLog.info("Login (Dongle Accepted) !", {
//         ProductId: `${productId}`,
//         Secret: `${usb.secret}`,
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }
// );

///////////////////////////////////////////////////////////////////////////////////Log In USERNAME& PWD

// @route  api/users/auth/:usbId
// @desc   Login user
// @access Public
router.post(
  "/auth/login",
  //Input validation
  [
    check("username", "Please include a Username.").not().isEmpty(),
    check("password", "Please enter a password.").exists(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const usbId = req.params.usbId;
    // console.log("UsbID:", req.params.usbId);
    // if (!usbId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({
    //     errors: [
    //       {
    //         msg: "User does not exist",
    //       },
    //     ],
    //   });
    // }
    const { username, password } = req.body;

    try {
      //See if the user exists

      let user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials." }] });
      }
      let isUsernameMatch = username === user.username;
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch || !isUsernameMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials." }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log("payload : ", payload);
      // JWT SignIn : Creation access Token
      jwt.sign(payload, JWTSECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.cookie("token", token, { httpOnly: true });
        res.json({ token });
      });
      ///////////////////////////////////////////////////////////////////////LOG LOGIN
      userLog.info("Login (Username & Password Accepted) !", {
        Name: `${user.name}`,
        Username: `${user.username}`,
        Type: `${user.userType}`,
        ProductId: `${user.usb.productId}`,
        Secret: `${user.usb.secret}`,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/////////////////////////////////////////////////////////////////////////////////// Log Out
// @route  api/users/auth
// @desc   Logout user / clear cookie
// @access Private
router.post("/auth/logout", async (req, res) => {
  //get token from header
  const token = req.header("x-auth-token");
  try {
    jwt.destroy(token);
    return res.json("destroyed");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/////////////////////////////////////////////////////////////////////////////// IP DETECTED
router.put("/ip", auth.token, [], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { ip } = req.body;
  try {
    //See if admin
    const admin = await User.findById(req.user.id).select("-password");
    if (admin && admin.userType == "admin") {
      //See if there is a Chat_Doc exist
      const chat = await Chat.find();

      for (i = 0; i < chat.length; i++) {
        chat[i].ip = ip.ip;
        console.log(
          "Server is Connected to the Internet, and his IP_ADDRESS is :",
          ip.ip
        );

        await chat[i].save();
      }
      return res.json("Done !!");
    } else {
      return res.json("NO !!");
    }
  } catch (err) {
    console.error("err:" + err.message);
    res.status(500).send("Server error");
  }
});

////////////////////////////////////////////////////////////////////////////////// Add New User
// @route   POST api/users
// @desc    Register user and return his Token
// @access  only admin
router.post(
  "/",
  auth.token,
  //Input validation
  [
    check("secret", "Please include a Secret.").not().isEmpty(),
    check("productId", "Please include a ProductId.").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),
    check("userType", "Please include a user type.").isIn([
      "user",
      "broadcaster",
    ]),
    check("username", "Please include a Username.").not().isEmpty(),

    check("name", "Name is required.").not().isEmpty(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, productId, secret } = req.body;
    console.log("This is the PiD of the new User", productId);
    console.log("This is the secret of the new User", secret);
    try {
      //See if admin
      const admin = await User.findById(req.user.id).select("-password");

      if (!admin || admin.userType !== "admin") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Only admin can add user." }] });
      }

      // let user = await User.findOne({ "email": email.toString() });
      let user1 = await User.findOne({ "usb.productId": productId.toString() });
      let user2 = await User.findOne({ "usb.secret": secret.toString() });
      let user3 = await User.findOne({ name: req.body.name });

      const {
        name,
        username,
        password,
        date,
        firstConnect,
        userType,
        location,
        //allowedMissions
      } = req.body;

      let user = await User.findOne({ username });
      if (user3) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User with this Name already exists." }] });
      }
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User with this Username already exists." }],
        });
      }
      if (user1) {
        return res.status(400).json({
          errors: [{ msg: "User with this Product ID already exists." }],
        });
      }
      if (user2) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User with this Secret already exists." }] });
      }

      user = new User({
        name,
        username,
        password,
        secret,
        productId,
        userType,
        location,
        usb: {
          productId,
          secret,
        },
        //allowedMissions,
        firstConnect,
        date,
      });
      //Regular expression for password validation
      const regexp =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{15,}$/;

      // Password Validation & Matching & Encrypt
      if (password) {
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(password)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Uppercase Character.",
              },
            ],
          });
        }

        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(password)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Lowercase Character.",
              },
            ],
          });
        }

        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(password)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Digit.",
              },
            ],
          });
        }

        const isContainsSymbol =
          /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(password)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Special Character.",
              },
            ],
          });
        }
      }
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      //Return jwt(json web token)
      const payload = {
        user: {
          id: user.id,
        },
      };
      res.json(payload);
      ///////////////////////////////////////////////////////////////////////LOG ADD NEW USER
      userLog.info("Admin Add a new user !", {
        Name: `${user.name}`,
        Username: `${user.username}`,
        Type: `${user.userType}`,
        ProductId: `${user.usb.productId}`,
        Secret: `${user.usb.secret}`,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

////////////////////////////////////////////////////////////////////////////////// Get All Users
// @route   Get api/users/all
// @desc    get user informations by user id
// @access  only admin
router.get("/all", auth.token, async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select("userType");
    {
      const user = await User.find()
        .select("-password")
        .lean()
        .populate("allowedMissions", "name");
      if (!user) return res.status(400).json({ msg: "There is no user " });
      else {
        for (i = 0; i < user.length; i++) {
          table = [];
          table[i] = user[i].allowedMissions;
          let res = table[i].map(({ name }) => name);
          user[i].allowedMissions = res;
        }
        res.json(user);
      }
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.status(500).send("Server Error");
  }
});

///////////////////////////////////////////////////////////////////////////////// Update OWN ACCOUNT
// @route   PUT api/users/me
// @desc    UPDATE  current user
// @access  private
router.put(
  "/myaccount",
  auth.token,
  //Input validation
  [
    //check("email", "Please include a valid Email.").isEmail(),
    check("oldpassword", "Old Password is required.").not().isEmpty(),
  ],
  async (req, res) => {
    //if errors then show errors message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const {
      name,
      /*email,*/ oldpassword,
      newpassword,
      confirmpassword,
      location,
    } = req.body;

    try {
      // See if user exists
      //let user = await User.findById(req.user.id).select("password");
      let user = await User.findById(req.user.id);

      //console.log(user);
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "User does not exist" }],
        });
      }
      if (oldpassword) {
        const isMatch = await bcrypt.compare(oldpassword, user.password);

        if (!isMatch) {
          return res.status(400).json({
            errors: [
              {
                msg: "Incorrect Old Password",
              },
            ],
          });
        }
      }

      // Password Validation & Matching & Encrypt
      if (newpassword) {
        //Pwd Validation
        if (newpassword.length < 8) {
          return res.status(400).json({
            errors: [
              {
                msg: "Please enter a password with 8 or more characters.",
              },
            ],
          });
        }

        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Uppercase Character.",
              },
            ],
          });
        }

        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Lowercase Character.",
              },
            ],
          });
        }

        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Digit.",
              },
            ],
          });
        }

        const isContainsSymbol =
          /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Special Character.",
              },
            ],
          });
        }

        //Pwd Matching
        if (newpassword !== confirmpassword) {
          return res.status(400).json({
            errors: [
              {
                msg: "Passwords do not match",
              },
            ],
          });
        }
        //Pwd Hash
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);
      }
      //if (email) user.email = email;
      if (name) user.name = name;
      if (location) user.location = location;
      //return jwt(json web token)
      ///////////////////////////////////////////////////////////////////////LOG UPDATE OWN ACCOUNT
      userLog.info("Own account updated !", {
        Name: `${user.name}`,
        // Email: `${user.email}`,
        //Password: `${newpassword}`,
        Type: `${user.userType}`,
        Location: `${user.location}`,
        ProductId: `${user.usb.productId}`,
        Secret: `${user.usb.secret}`,
      });
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: user,
        },
        {
          new: true,
        }
      ).select("-password");
      // console.log(user);

      return res.json(user);
    } catch (err) {
      console.error("err:" + err.message);
      res.status(500).send("Server error");
    }
  }
);

/////////////////////////////////////////////////////////////////////////////// Change Password, "First Connect"
router.put(
  "/me",
  auth.token,
  [
    check("oldpassword", "Old Password is required.").not().isEmpty(),
    check(
      "newpassword",
      "Please enter a new password with 8 or more characters."
    ).isLength({ min: 8 }),
    check("confirmpassword", "Confirm your password.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { oldpassword, newpassword, confirmpassword } = req.body;
    try {
      // See if user exists
      //let user = await User.findById(req.user.id).select("password");
      let user = await User.findById(req.user.id);

      //console.log(user);
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "User does not exist" }],
        });
      }
      if (oldpassword) {
        const isMatch = await bcrypt.compare(oldpassword, user.password);

        if (!isMatch) {
          return res.status(400).json({
            errors: [
              {
                msg: "Incorrect Old Password.",
              },
            ],
          });
        }
      }

      // Password Validation
      if (newpassword) {
        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Uppercase Character.",
              },
            ],
          });
        }

        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Lowercase Character.",
              },
            ],
          });
        }

        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Digit.",
              },
            ],
          });
        }

        const isContainsSymbol =
          /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(newpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Special Character.",
              },
            ],
          });
        }
      }

      // Password Confirm
      if (newpassword !== confirmpassword) {
        return res.status(400).json({
          errors: [
            {
              msg: "Passwords do not match.",
            },
          ],
        });
      }

      // encrypt password
      if (newpassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);
      }

      //      user.firstConnect = false;
      user.firstConnect = false;
      //return jwt(json web token)
      ///////////////////////////////////////////////////////////////////////LOG Change Password First Connect
      userLog.info("First Connect (Change Password) !", {
        Name: `${user.name}`,
        Username: `${user.username}`,
        //Password: `${newpassword}`,
        Type: `${user.userType}`,
        Location: `${user.location}`,
        ProductId: `${user.usb.productId}`,
        Secret: `${user.usb.secret}`,
      });
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: user,
        },
        {
          new: true,
        }
      ).select("-password");
      console.log(user);

      return res.json(user);
    } catch (err) {
      console.error("err:" + err.message);
      res.status(500).send("Server error");
    }
  }
);

////////////////////////////////////////////////////////////////////////////// Update user profile
// @route   PUT api/users/update/:id
// @desc    UPDATE user
// @access  only admin
router.put(
  "/edit",
  auth.token,
  [
    check("username", "Please include a Username.").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
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
      username,
      userType,
      location,
      allowedMissions,
      resetpassword,
    } = req.body;

    try {
      //////////// Only ADMIN CAN EDIT USERS
      const admin = await User.findById(req.user.id).select("userType");

      if (!admin || admin.userType != "admin") {
        return res
          .status(400)
          .json({ errors: [{ msg: "Only Admin can edit users." }] });
      }

      //////////// See if user exists
      const id = req.body._id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          errors: [
            {
              msg: "User does not exist",
            },
          ],
        });
      }

      let user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User does not exist",
            },
          ],
        });
      }

      //////// Reset Password Validation & Encrypt
      if (resetpassword) {
        if (resetpassword.length < 8) {
          return res.status(400).json({
            errors: [
              {
                msg: "Please enter a password with 8 or more characters.",
              },
            ],
          });
        }

        const isContainsUppercase = /^(?=.*[A-Z])/;
        if (!isContainsUppercase.test(resetpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Uppercase Character.",
              },
            ],
          });
        }

        const isContainsLowercase = /^(?=.*[a-z])/;
        if (!isContainsLowercase.test(resetpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must have at least one Lowercase Character.",
              },
            ],
          });
        }

        const isContainsNumber = /^(?=.*[0-9])/;
        if (!isContainsNumber.test(resetpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Digit.",
              },
            ],
          });
        }

        const isContainsSymbol =
          /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
        if (!isContainsSymbol.test(resetpassword)) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must contain at least one Special Character.",
              },
            ],
          });
        }

        //////// Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(resetpassword, salt);
        user.firstConnect = true;
      }

      if (username) {
        let user1 = await User.findOne({ username: req.body.username });
        if (user1 && user1._id != id) {
          return res.status(400).json({
            errors: [{ msg: "User with this Username already exists." }],
          });
        }
        /* else {
                               return res
                              .status(400)
                              .json({ errors: [{ msg: "Please include a valid Email." }] });}  */
        user.username = username;
      }

      if (name) {
        let user1 = await User.findOne({ name: req.body.name });
        if (user1 && user1._id != id) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User with this Name already exists." }] });
        }
        user.name = name;
      }
      //////// After changing userType of the user, Delete his allowed missions and delete him from allowed users of that missions
      if (userType) {
        //  mission = await Mission.findByIdAndUpdate(
        //   user.allowedMissions,
        //     { $pull: { allowedUsers : id} },
        //     { new: true }
        //   );
        mission = await Mission.updateMany(
          { _id: user.allowedMissions },
          { $pull: { allowedUsers: id } }
        );
        user.allowedMissions = [];
        user.userType = userType;
      }
      if (location) user.location = location;

      ///////////////////////////////////////////////////////////////////////LOG UPDATE USER PROFILE
      userLog.info("Admin Update User's Profile !", {
        Name: `${user.name}`,
        Username: `${user.username}`,
        //ResetPassword: `${resetpassword}`,
        Type: `${user.userType}`,
        Location: `${user.location}`,
      });
      user = await User.findByIdAndUpdate(
        id,
        {
          $set: user,
        },
        {
          new: true,
        }
      ).select("-password");
      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;

//////////////////////////////////////////////////////////////////////////////APIs NOT USED In The APP////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////// NOT USED IN THE APP

// @route   Get api/users/usertype/:user_type
// @desc    get user informations by user id
// @access  only admin
// router.get("/usertype/:user_type", auth.token, async (req, res) => {
//   totp.options = {
//     // epoch: Date.now(),
//     step: 30,
//     window: 1,
//   };
//   try {
//     const admin = await User.findById(req.user.id).select("userType");
//     if (admin.userType != "admin") {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: "Only admin can get user." }] });
//     }
//     const types = ["user", "admin", "broadcaster"];
//     if (!types.includes(req.params.user_type)) {
//       return res.status(400).json({ msg: "Invalid type" });
//     }
//     const user = await User.find({ userType: req.params.user_type })
//       .select("-password")
//       .populate("allowedMissions", ["-allowedUsers"]);
//     if (!user || user.length === 0)
//       return res.status(400).json({ msg: "There is no user" });
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind == "ObjectId") {
//       return res.status(400).json({ msg: "There is no user" });
//     }
//     res.status(500).send("Server Error");
//   }
// });

///////////////////////////////////////////////////////////////////////////// NOT USED IN THE APP

///////////////////////////////////////////////////////////////////////////// NOT USED IN THE APP

// @route   DELETE api/users/delete/:id
// @desc    DELETE user
// @access  only admin
// router.delete("/delete/:id", auth.token, async (req, res) => {
//   try {
//     // only admin can modify
//     const admin = await User.findById(req.user.id).select("-password");
//     if (!admin && admin.userType != "admin") {
//       return res.status(400).json({
//         errors: [{ msg: "Only admin can delete users." }],
//       });
//     }
//     // See if user exists
//     const id = req.params.id;
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         errors: [
//           {
//             msg: "User does not exist",
//           },
//         ],
//       });
//     }
//     let user = await User.findById(id).select("-password");
//     if (!user) {
//       return res.status(400).json({
//         errors: [
//           {
//             msg: "User does not exist",
//           },
//         ],
//       });
//     }

//     // remove user
//     await User.findOneAndRemove({ _id: req.params.id });
//     res.json({ msg: "user deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });
