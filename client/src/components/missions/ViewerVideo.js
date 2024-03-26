//Default Viewer Component
import React, { Fragment, useEffect, useState } from "react";
//import "./VideoPage.css";
import io from "socket.io-client";
import { useLocation } from "react-router";
import queryString from "query-string";
import { makeStyles } from "@material-ui/core/styles";

import Alert from "@material-ui/lab/Alert";
import Record from "./Record";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  alignItemsAndJustifyContent: {
    opacity: "0.2",
    margin: "0",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));
export default function Viewer() {
  let videoRef = React.createRef();
  const classes = useStyles();

  let location = useLocation();
  const [room, setRoom] = useState();
  const [name, setName] = useState();
  const [src, setSrc] = useState(null);
  const [exist, setExist] = useState(false);

  useEffect(() => {
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
    let peerConnection;

    const socket = io.connect();
    window.onunload = window.onbeforeunload = function () {
      socket.close();
    };
    const { name, room } = queryString.parse(location.search);
    setRoom(room);
    setName(name);

    let video = videoRef.current;

    socket.on("offer", function (id, description) {
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(function () {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = function (event) {
        video.srcObject = event.streams[0];
        setSrc(event.streams[0]);
        if (!exist) setExist(true);
      };

      //
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });

    if (room) {
      socket.emit("join", room);
      socket.emit("ready");

      // console.log('watcher join room: ' + room);
    }
    socket.on("candidate", function (id, candidate) {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.on("connect", function () {
      socket.emit("watcher");
    });

    socket.on("broadcaster", function () {
      socket.emit("watcher");
    });

    socket.on("bye", function () {
      peerConnection.close();
    });
  }, []);
  return (
    <div>
      <video
        style={{ height: "87vh", width: "100%" }}
        autoPlay={true}
        muted
        controls
        ref={videoRef}
      />
      {exist ? (
        <Fragment>
          {" "}
          <Alert
            severity="info"
            className={classes.alignItemsAndJustifyContent}
            variant="outlined"
          >
            {name}
          </Alert>
          <Record mission={room} streams={src} />
        </Fragment>
      ) : (
        <Alert
          severity="error"
          className={classes.alignItemsAndJustifyContent}
          variant="filled"
        >
          verify the broadcaster and refresh the page
        </Alert>
      )}
    </div>
  );
}
