import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@mui/icons-material/Person";
// import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { setUser } from "../../actions/user";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import Tooltip from "@material-ui/core/Tooltip";
// import Fab from "@material-ui/core/Fab";
import CreateIcon from "@material-ui/icons/Create";
// import users from "../../reducers/users";

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 345,
//   },
//   media: {
//     height: 140,
//   },
// });

function MediaCard({
  setuser,
  setUser,
  user: { _id, name, username, userType, location, allowedMissions },
}) {
  // const classes = useStyles();
  const user = {
    _id,
    name,
    username,
    userType,
    location,
    allowedMissions,
  };
  const onClick = (e) => setUser(user);

  ///////////////////////////////////////////////////////////////////////////////////////Remove This const, and call "mission.date"

  return (
    <Grid item>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon color="primary" />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={
              <a href="/dashboard" style={{ fontWeight: "bold" }}>
                {" "}
                {name}{" "}
              </a>
            }
            secondary={userType}
            key={_id}
          />

          <Link to="/modifyuser">
            <Tooltip onClick={(e) => onClick(e)} title="Modify user">
              <IconButton aria-label="modify">
                <CreateIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Link>

          {/*  USEFUL DELETE BLOCK
                                <Link to="/modifyuser">
                                    <Tooltip title="Modify user">
                                          <IconButton onClick={(e) => onClick(e)} aria-label="modify">
                                            <DeleteIcon color="primary" />
                                          </IconButton>
                                    </Tooltip>
                                </Link>  */}

          {/*  unuseful DELETE USER block
                                
                                <ListItemSecondaryAction>
                                      <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                      </IconButton>
                                </ListItemSecondaryAction>*/}
        </ListItem>
      </List>
    </Grid>
  );
}

MediaCard.propTypes = {
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  setuser: state.setuser,
});

export default connect(mapStateToProps, { setUser })(MediaCard);
