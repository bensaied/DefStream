import React, { useEffect, useState, Fragment } from "react";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import queryString from "query-string";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { useLocation } from "react-router";
import Typography from "@material-ui/core/Typography";
import bot from "../icons/bot.png";
import me from "../icons/me.png";
import other from "../icons/other.png";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    zIndex: "1",
  },
  time: {
    display: "inline",
    position: "absolute",
    right: 10,
    fontSize: 12,
  },
  inline: {
    display: "inline",
  },
  bott: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    zIndex: "1",
  },
  field: { minwidth: "300px", position: "absolute", bottom: 10, zIndex: "3" },
}));
const ChatMessage = ({
  chatMessage: { username, time, text },
  ip: { ip },
  //auth: { auth },
}) => {
  const classes = useStyles();
  let location = useLocation();
  const [name, setName] = useState();
  useEffect(() => {
    const { name } = queryString.parse(location.search);
    setName(name);

    // console.log("MESSAGE :", `http://${ip}:5000/${text}`);
  }, [location.search]);

  return (
    <Fragment key={username.id}>
      <ListItem key={username.id} component={"div"} alignItems="flex-start">
        <ListItemAvatar tag="div">
          <Avatar
            component={"span"}
            alt={username}
            src={
              username === "DefStream Bot"
                ? bot
                : username === name
                ? me
                : other
            }
          />
        </ListItemAvatar>
        <ListItemText
          tag="div"
          primary={
            <a href="/dashboard" style={{ fontWeight: "bold" }}>
              {" "}
              {username}{" "}
            </a>
          }
          secondary={
            <Fragment>
              <Typography
                component={"span"}
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 3, text.length) === "mp4") ||
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 3, text.length) === "mkv") ||
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 3, text.length) === "avi") ||
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 3, text.length) === "mov") ||
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 3, text.length) === "wav") ||
                  // (text.substring(0, 8) === "uploads/" &&
                  //   text.substring(text.length - 4, text.length) === "mpeg") ? (
                  //   <video
                  //     style={{ maxWidth: "200px" }}
                  //     //src={`http://localhost:5000/${text}`}
                  //     src={`https://192.168.100.148:5000/${text}`}
                  //     //src={`http://${ip}:5000/${text}`}
                  //     alt="video"
                  //     type="video/mp4"
                  //     controls
                  //   />
                  // ) : (text.substring(0, 8) === "uploads/" &&
                  //     text.substring(text.length - 4, text.length) === "jpeg") ||
                  //   (text.substring(0, 8) === "uploads/" &&
                  //     text.substring(text.length - 3, text.length) === "jpg") ||
                  //   (text.substring(0, 8) === "uploads/" &&
                  //     text.substring(text.length - 3, text.length) === "png") ||
                  //   (text.substring(0, 8) === "uploads/" &&
                  //     text.substring(text.length - 3, text.length) === "bmp") ? (
                  //   <img
                  //     style={{ maxWidth: "200px" }}
                  //     // src={`http://localhost:5000/${text}`}
                  //     src={`https://192.168.100.148:5000/${text}`}
                  //     // src={`http://${ip}:5000/${text}`}
                  //     alt="img"
                  //     download
                  //   />
                  // ) :
                  text.substring(0, 8) === "uploads/" ? (
                    <a
                      style={{ color: "blue" }}
                      //href={"http://localhost:5000/" + text}
                      //href={"https://192.168.100.148:5000/" + text}
                      href={`https://${ip}:5000/${text}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {" "}
                      {text.substring(8, text.length)}
                    </a>
                  ) : (
                    text
                  )
                }
              </Typography>{" "}
              <br />
              <Typography component={"span"} className={classes.time}>
                {time}
              </Typography>
            </Fragment>
          }
        />
      </ListItem>
      <br />
      <Divider variant="inset" component="li" />
    </Fragment>
  );
};

export default ChatMessage;
