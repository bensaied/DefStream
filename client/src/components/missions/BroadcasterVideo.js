// Default Component
import React, { Component } from "react";
import io from "socket.io-client";
import queryString from "query-string";

export default class Broadcaster extends Component {
  constructor() {
    super();
    this.videoRef = React.createRef();
    this.aa = this.props.location.search;
  }

  componentDidMount() {
    const config = {
      // eslint-disable-line no-unused-vars
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
        {
          urls: ["stun:stun.l.google.com:19303"],
        },
        {
          urls: ["stun:stun.l.google.com:19304"],
        },
        {
          urls: ["turn:openrelay.metered.ca:443"],
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: ["turn:openrelay.metered.ca:443?transport=tcp"],
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: ["turn:turn.anyfirewall.com:443?transport=tcp"],
          username: "webrtc",
          credential: "webrtc",
        },
      ],
    };
    const peerConnections = {};

    const socket = io.connect();
    window.onunload = window.onbeforeunload = function () {
      socket.close();
    };
    const video = this.videoRef.current;
    const constraints = { video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        socket.emit("broadcaster");
      })
      .catch((error) => console.error(error));

    socket.on("answer", function (id, description) {
      peerConnections[id].setRemoteDescription(description);
    });

    const { room } = queryString.parse(this.aa);

    if (room && !!room) {
      socket.emit("join", room);
      //console.log('broadcaster join room: ' + room);
    }

    socket.on("ready", function (id) {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });
    socket.on("watcher", function (id) {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;
      let stream = video.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });

    socket.on("candidate", function (id, candidate) {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("bye", function (id) {
      peerConnections[id] && peerConnections[id].close();
      delete peerConnections[id];
    });
  }
  render() {
    return (
      <div>
        <video
          style={{ height: "87vh", width: "100%" }}
          autoPlay={true}
          controls
          ref={this.videoRef}
        />
      </div>
    );
  }
}

// Customized Component
// import React, { Component } from "react";
// import io from "socket.io-client";
// import queryString from "query-string";

// export default class Broadcaster extends Component {
//   constructor() {
//     super();
//     this.videoRef = React.createRef();
//     this.aa = this.props.location.search;
//   }

//   componentDidMount() {
//     const config = {
//       // eslint-disable-line no-unused-vars
//       iceServers: [
//         {
//           urls: ["stun:stun.l.google.com:19302"],
//         },
//         {
//           urls: ["stun:stun.l.google.com:19303"],
//         },
//         {
//           urls: ["stun:stun.l.google.com:19304"],
//         },
//         {
//           urls: ["turn:openrelay.metered.ca:443"],
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//         {
//           urls: ["turn:openrelay.metered.ca:443?transport=tcp"],
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//         {
//           urls: ["turn:turn.anyfirewall.com:443?transport=tcp"],
//           username: "webrtc",
//           credential: "webrtc",
//         },
//       ],
//     };
//     const peerConnections = {};

//     // Default Socket definition
//     const socket = io().connect();

//     //Customized Socket definition

//     // const socket = io({
//     //   //  transports: ["websocket"],
//     //   reconnection: true,
//     //   reconnectionAttempts: 10,
//     //   reconnectionDelay: 1000,
//     //   reconnectionDelayMax: 5000,
//     // });
//     // socket.connect();

//     window.onunload = window.onbeforeunload = function () {
//       socket.close();
//     };
//     const video = this.videoRef.current;
//     const constraints = { video: true };
//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then((stream) => {
//         video.srcObject = stream;
//         socket.emit("broadcaster");
//       })
//       .catch((error) => console.error(error));

//     socket.on("answer", function (id, description) {
//       peerConnections[id].setRemoteDescription(description);
//     });

//     const { room } = queryString.parse(this.aa);

//     if (room && !!room) {
//       socket.emit("join", room);
//       //console.log('broadcaster join room: ' + room);
//     }

//     socket.on("ready", function (id) {
//       const peerConnection = new RTCPeerConnection(config);
//       peerConnections[id] = peerConnection;
//       let stream = video.srcObject;
//       stream
//         .getTracks()
//         .forEach((track) => peerConnection.addTrack(track, stream));
//       peerConnection
//         .createOffer()
//         .then((sdp) => peerConnection.setLocalDescription(sdp))
//         .then(function () {
//           socket.emit("offer", id, peerConnection.localDescription);
//         });
//       peerConnection.onicecandidate = function (event) {
//         if (event.candidate) {
//           socket.emit("candidate", id, event.candidate);
//         }
//       };
//     });
//     socket.on("watcher", function (id) {
//       const peerConnection = new RTCPeerConnection(config);
//       peerConnections[id] = peerConnection;
//       let stream = video.srcObject;
//       stream
//         .getTracks()
//         .forEach((track) => peerConnection.addTrack(track, stream));
//       peerConnection
//         .createOffer()
//         .then((sdp) => peerConnection.setLocalDescription(sdp))
//         .then(function () {
//           socket.emit("offer", id, peerConnection.localDescription);
//         });
//       peerConnection.onicecandidate = function (event) {
//         if (event.candidate) {
//           socket.emit("candidate", id, event.candidate);
//         }
//       };
//     });

//     socket.on("candidate", function (id, candidate) {
//       peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     socket.on("bye", function (id) {
//       peerConnections[id] && peerConnections[id].close();
//       delete peerConnections[id];
//     });
//   }
//   render() {
//     return (
//       <div>
//         <video
//           style={{ height: "87vh", width: "100%" }}
//           autoPlay={true}
//           controls
//           ref={this.videoRef}
//         />
//       </div>
//     );
//   }
// }
