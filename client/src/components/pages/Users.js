import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
//import List from "@material-ui/core/List";
import List from "./List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
// import ListItemText from "@material-ui/core/ListItemText";
// import Avatar from "@material-ui/core/Avatar";
// import IconButton from "@material-ui/core/IconButton";
// import FolderIcon from "@material-ui/icons/Folder";
// import DeleteIcon from "@material-ui/icons/Delete";
// import CreateIcon from "@material-ui/icons/Create";
// import Tooltip from "@material-ui/core/Tooltip";
// import PersonIcon from '@mui/icons-material/Person';
// import { useState } from "react";
import PropTypes from "prop-types";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { logout } from "../../actions/user";

//////////////////////////////////////////////////////////////////////////////////////////////////////GET USERS Logic

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function Users({ setAlert, logout, users, auth }) {
  const classes = useStyles();
  // const [setAnchorEl] = useState(null);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const onChange = (e) => {};
  // const onSubmit = async (e) => {};

  return (
    <div className={classes.root}>
      <div className={classes.demo}>
        {auth.user && auth.user.userType === "admin" ? (
          <Grid
            container
            direction="column"
            justifyContent="center"
            //alignItems="center"
            spacing={0}
          >
            {users.users.length === 1 ? (
              <Alert
                severity="error"
                className={classes.alignItemsAndJustifyContent}
                variant="outlined"
              >
                There is no user !
              </Alert>
            ) : (
              ""
            )}

            {users.users
              .filter(
                (users) =>
                  users.userType === "user" || users.userType === "broadcaster"
              )
              .map((users) => (
                <List key={Math.random()} user={users} />
              ))}
          </Grid>
        ) : (
          ""
          //  history.push("/404")
        )}
      </div>
    </div>
  );
}

Users.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert, logout })(Users);
