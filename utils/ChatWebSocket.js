const CHAT_BOT = "DefStream Bot";
//chat requirements
const formatMessage = require("./messages");
const moment = require("moment");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./connectedUsers");
const _ = require("lodash");

// const option1 = [{username:'Ali', text: "im ALI",time: '14:13'},{username:'MedAli', text: "are u ok !",time: '19:20'},{username:'Amira', text: "Helloo!",time: '17:00'}]

//socket.io Events
//Listening for client connection
/**
 * If you would like to emit a message to the single user that connects to the server use socket.emit()
 * If you would like to emit a message to everybody excepts the user who just connected to the server use socket.broadcast.emit()
 * If you would like to broadcast to everybody use io.emit()
 */

//OLD ONE
// module.exports = function (io) {
//   io.on("connection", (socket) => {
//     // console.log("New socket connection: ", socket.id);

//     socket.on("joinRoom", ({ username, room }) => {
//       // Join room
//       const user = userJoin(socket.id, username, room);
//       socket.join(user.room);
//       // Welcome connect user

//       socket.emit(
//         "message",
//         formatMessage(
//           CHAT_BOT,
//           `Welcome ${username} to ${user.room} !!`,
//           moment().format("HH:mm")
//         )
//       );

//       // If you want map an existing messages (Static)
//       //    option1.map((message)=>( socket.emit(
//       //   "message",
//       //   formatMessage(message.username,message.text, message.time))
//       // ))

//       //Broadcat when a user connects
//       //To broadcast to a specific room, you need to use socket.broadcast.to('roomName').emit()

//       socket.broadcast
//         .to(user.room)
//         .emit(
//           "message",
//           formatMessage(
//             CHAT_BOT,
//             `${user.username} has joined mission ${user.room}`,
//             moment().format("HH:mm")
//           )
//         );

//       // Send users and room info
//       io.to(user.room).emit("roomUsers", {
//         room: user.room,
//         users: getRoomUsers(user.room),
//       });
//       //Listen for incoming chatMessage
//       socket.on("chatMessage", (msg) => {
//         const user = getCurrentUser(socket.id);
//         io.to(user.room).emit(
//           "message",
//           formatMessage(user.username, msg, moment().format("HH:mm"))
//         );
//       });

//       //Handling User disconnect Events
//       socket.on("disconnect", () => {
//         const user = userLeave(socket.id);
//         if (user) {
//           io.to(user.room).emit(
//             "message",
//             formatMessage(CHAT_BOT, `${user.username} has disconnected`)
//           );
//           // Send users and room info
//           socket.broadcast.to(user.room).emit("roomUsers", {
//             room: user.room,
//             users: getRoomUsers(user.room),
//           });
//         }
//       });
//     });
//   });
// };

//New One
module.exports = function (io) {
  io.on("connection", (socket) => {
    // console.log("New socket connection: ", socket.id);

    // Debounce the joinRoom event to limit its frequency
    const joinRoom = _.debounce(({ username, room }) => {
      // socket.on(
      //   "joinRoom",
      //   ({ username, room }) => {
      // Join room
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);
      // Welcome connect user

      socket.emit(
        "message",
        formatMessage(
          CHAT_BOT,
          `Welcome
          to ${user.room} !!`,
          moment().format("HH:mm")
        )
      );

      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(
            CHAT_BOT,
            `${user.username} has joined mission ${user.room}`,
            moment().format("HH:mm")
          )
        );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }, 1000);

    socket.on("joinRoom", joinRoom);

    //Listen for incoming chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit(
        "message",
        formatMessage(user.username, msg, moment().format("HH:mm"))
      );
    });

    //Handling User disconnect Events
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(
            CHAT_BOT,
            `${user.username} has disconnected`,
            moment().format("HH:mm")
          )
        );
        // Send users and room info
        socket.broadcast.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
