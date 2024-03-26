//socket.io Events
//Listening for client connection
/**
 * If you would like to emit a message to the single user that connects to the server use socket.emit()
 * If you would like to emit a message to everybody excepts the user who just connected to the server use socket.broadcast.emit()
 * If you would like to broadcast to everybody use io.emit()
 */

///Default VideoStreamSocket
module.exports = function (io) {
  io.on("connection", (socket) => {
    let broadcaster;
    socket.on("join", function (room) {
      console.log("join " + room);
      socket.on("ready", function () {
        socket.broadcast.to(room).emit("ready", socket.id);
      });
      socket.on("broadcaster", function () {
        broadcaster = socket.id;
        socket.broadcast.to(room).emit("broadcaster");
      });
      socket.on("watcher", function () {
        broadcaster && socket.broadcast.to(room).emit("watcher", socket.id);
      });
      socket.on("offer", function (id /* of the watcher */, message) {
        socket
          .to(id)
          .emit("offer", socket.id /* of the broadcaster */, message);
      });
      socket.on("answer", function (id /* of the broadcaster */, message) {
        socket.to(id).emit("answer", socket.id /* of the watcher */, message);
      });
      socket.on("candidate", function (id, message) {
        socket.to(id).emit("candidate", socket.id, message);
      });
      socket.on("disconnect", function () {
        broadcaster && socket.to(broadcaster).emit("bye", socket.id);
      });
      socket.join(room);
    });
    //
  });
};
//Customized VideoStreamSocket
// module.exports = function (io) {
//   io.on("connection", (socket) => {
//     let broadcaster;
//     socket.on("join", function (room) {
//       //console.log("join " + room);
//       socket.on("ready", function () {
//         socket.broadcast.to(room).emit("ready", socket.id);
//       });
//       socket.on("broadcaster", function () {
//         broadcaster = socket.id;
//         socket.broadcast.to(room).emit("broadcaster");
//       });
//       socket.on("watcher", function () {
//         broadcaster && socket.broadcast.to(room).emit("watcher", socket.id);
//       });
//       socket.on("offer", function (id /* of the watcher */, message) {
//         socket
//           .to(id)
//           .emit("offer", socket.id /* of the broadcaster */, message);
//       });
//       socket.on("answer", function (id /* of the broadcaster */, message) {
//         socket.to(id).emit("answer", socket.id /* of the watcher */, message);
//       });
//       socket.on("candidate", function (id, message) {
//         socket.to(id).emit("candidate", socket.id, message);
//       });
//       socket.on("disconnect", function () {
//         broadcaster && socket.to(broadcaster).emit("bye", socket.id);
//       });
//       socket.join(room);
//     });
//     //
//   });
// };
