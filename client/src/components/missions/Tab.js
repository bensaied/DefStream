import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Dropzone from "react-dropzone";

import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { green } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Divider from "@material-ui/core/Divider";
import ChatMessage from "./ChatMessage";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { getChat, getIP, addMessage } from "../../actions/chat";
import TextField from "@material-ui/core/TextField";
import TelegramIcon from "@material-ui/icons/Telegram";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { blue } from "@material-ui/core/colors";
//import socket
import io from "socket.io-client";
import { Button } from "@material-ui/core";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { LinearProgress } from "@material-ui/core";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  //Button,
} from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  tabRoot: {
    minWidth: 10,
  },
  test: {
    all: "none",
  },
  roots: {
    position: "relative",
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    zIndex: "1",
  },
  inline: {
    display: "inline",
  },
  bott: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    zIndex: "1",
  },

  field: {
    minwidth: "100%",
    maxWidth: "100%",
    position: "absolute",
    bootom: "0px",
    marginBottom: "2%",
    zIndex: "3",
    display: "flex",
    alignItems: "center",
  },
}));

//let socket;

function ScrollableTabsButtonForce({
  // missions,
  //auth,
  setmission,
  getChat,
  getIP,
  addMessage,
  chat,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const scrollRef = useRef(null);
  const location = useLocation();
  const [socket, setSocket] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Avoid Violation, Improving the input handling logic
  const inputRef = useRef(null);

  // const handleInputKeyDown = (event) => {
  //   if (event.key === "Enter" && messages !== "") {
  //     // send message to server
  //     setMessages("");
  //   }
  // };

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  ///////////////////////////////////////////////////
  useEffect(() => {
    const handleInput = (event) => {
      if (event.target.tagName === "INPUT") {
        // handle input event
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        // Handle the Escape key press
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("input", function (event) {
      if (event.target.tagName === "INPUT") {
        // handle input event
      }
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("input", handleInput);
    };
  }, []);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    const username = name;
    let newSocket = io({
      //   transports: ["websocket"],
      // reconnectionDelay: 1000,
      // reconnectionAttempts: 10000,
    });

    setSocket(newSocket);

    window.onunload = window.onbeforeunload = function () {
      newSocket.close();
    };

    if (room) {
      getChat(room);
      getIP(room);
    }

    if (username) {
      newSocket.emit("joinRoom", { username, room });
    }

    newSocket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      //console.log("MESSAGE / ", message);
      addMessage(message.username, message.text, message.time, room);
    });

    newSocket.on("roomUsers", ({ room, users }) => {
      setUsers(users);
    });

    newSocket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });
  }, [location.search]);

  // THIS FOR UPLOADING FILES WITHOUT PROGRESSION BAR
  // const onDrop = useCallback(
  //   (files) => {
  //     async function fetchData() {
  //       let formData = new FormData();

  //       const config = {
  //         header: { "content-type": "multipart/form-data" },
  //       };

  //       formData.append("file", files[0]);
  //       await Axios.post(
  //         // "http://${chat.ip}:3000/api/chats/uploadfiles",
  //         "/api/chats/uploadfiles",
  //         formData,
  //         config
  //       ).then((response) => {
  //         if (response.data.success) {
  //           let chatMessage = response.data.url;
  //           socket.emit("chatMessage", chatMessage);
  //         }
  //       });
  //     }
  //     fetchData();
  //   },
  //   [socket]
  // );

  // THIS FOR UPLOADING FILES WITH PROGRESSION BAR
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setUploadProgress(progress);
      },
      maxContentLength: 200 * 1024 * 1024, // Maximum content length of 200 megabytes
    };

    axios
      .post("/api/chats/uploadfiles", formData, config)
      .then((response) => {
        if (response.data.success) {
          const chatMessage = response.data.url;
          socket.emit("chatMessage", chatMessage);
          setUploadProgress(0);
        }
      })
      .catch((error) => console.error(error));
  };

  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      const newMsg = e.target.value;
      if (newMsg !== msg) {
        setMsg(newMsg);
      }
    },
    [msg]
  );

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      // Emit msg to messages state (in the current component)
      socket.emit("chatMessage", msg);
      //Clear input
      if (msg !== "") {
        setMsg("");
      }
    },
    [socket, msg]
  );

  // This logic is used to filter List viewers and don't repeat the same username.
  let subjects = { users }.users;
  let viewers0 = subjects.map((o) => o.username);
  const viewers = subjects.filter(
    ({ username }, index) => !viewers0.includes(username, index + 1)
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            classes={{ root: classes.tabRoot }}
            label="Chat"
            icon={<ChatRoundedIcon />}
            {...a11yProps(0)}
          />
          <Tab
            classes={{ root: classes.tabRoot }}
            label="Info"
            icon={<InfoRoundedIcon />}
            {...a11yProps(1)}
          />
          <Tab
            classes={{ root: classes.tabRoot }}
            label="Viewers"
            icon={<PeopleRoundedIcon />}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Fragment>
          <Paper
            tag="div"
            className={classes.paper}
            style={{
              width: "auto",
              maxHeight: "100%",
              maxWidth: "100%",
              overflow: "auto",
            }}
          >
            <ul tag="div">
              <List component={"span"} className={classes.roots}>
                {chat.chat &&
                  chat.chat.map((msg) => (
                    <ChatMessage
                      key={msg.username + msg.text + msg.time + Math.random()}
                      chatMessage={msg}
                      ip={chat}
                    />
                  ))}
                {messages &&
                  messages.map((msg) => (
                    <ChatMessage
                      key={msg.username + msg.text + msg.time + Math.random()}
                      chatMessage={msg}
                      ip={chat}
                    />
                  ))}
              </List>
              <li key="1" ref={scrollRef} />
            </ul>
          </Paper>

          <div className={classes.field}>
            {" "}
            <TextField
              id="msg"
              label="Message"
              placeholder="Write your message"
              multiline
              edge="start"
              variant="outlined"
              fullWidth
              maxRows={1}
              value={msg}
              onChange={(e) => onChange(e)}
              //onKeyDown={handleInputKeyDown}
              ref={inputRef}
              onKeyPress={(e) => (e.key === "Enter" ? onClick(e) : null)}
            />
            &nbsp;&nbsp;&nbsp;
            {/* FOR UPLOAD FILES WITHOUT PROGRESSION BAR
             <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button title="Import file">
                      {" "}
                      <UploadFileIcon
                        style={{ color: blue[500] }}
                        edge="end"
                      />{" "}
                    </Button>
                  </div>
                </section>
              )}
            </Dropzone> */}
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button title="Import file">
                      {" "}
                      <UploadFileIcon
                        style={{ color: blue[500] }}
                        edge="end"
                      />{" "}
                    </Button>
                  </div>
                  {uploadProgress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      color="primary"
                    />
                  )}
                </section>
              )}
            </Dropzone>
            <IconButton
              title="Send message"
              onClick={(e) => onClick(e)}
              aria-label="delete"
            >
              <TelegramIcon style={{ color: blue[500] }} edge="end" />
            </IconButton>
            <br></br>
            <br />
            <br />
            <br />
            <br />
          </div>
        </Fragment>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {setmission.mission && setmission.mission.description}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <List dense className={classes.root}>
          {users &&
            viewers.map((user) => (
              <ListItem key={user.username}>
                <ListItemAvatar>
                  {/* <Avatar alt={user.username} src="./sfqf" /> */}
                  <Avatar alt={user.username} />
                </ListItemAvatar>
                <ListItemText id={user.username} primary={user.username} />
                <ListItemSecondaryAction>
                  <CheckCircleOutlineIcon
                    edge="end"
                    style={{ color: green[500] }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          <Divider />
        </List>
      </TabPanel>
    </div>
  );
}

ScrollableTabsButtonForce.propTypes = {
  // mission: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  getChat: PropTypes.func.isRequired,
  getIP: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  //auth: state.auth,
  missions: state.missions,
  chat: state.chat,
  setmission: state.setmission,
});
export default connect(mapStateToProps, { getChat, getIP, addMessage })(
  ScrollableTabsButtonForce
);
