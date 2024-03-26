import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "./Card";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import { grey } from "@material-ui/core/colors";
import SubscriptionsIcon from "@material-ui/icons/SubscriptionsOutlined";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";

import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import DuoOutlinedIcon from "@material-ui/icons/DuoOutlined";
import DefStreamLogo from "./logo.png";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PropTypes from "prop-types";
import { logout } from "../../actions/user";
import { getMissions } from "../../actions/mission";
import { setAlert } from "../../actions/alert";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import account from "../../components/icons/account.jpg";
import Fab from "@material-ui/core/Fab";
import Alert from "@material-ui/lab/Alert";

const drawerWidth = 240;
const drawerWidth0 = 330;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar1: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth0}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth0,
  },
  appBarShift1: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth0,
    flexShrink: 0,
  },
  drawer1: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    marginLeft: theme.spacing(3),
  },
  drawerOpen1: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose1: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 2),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth0,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content1: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  alignItemsAndJustifyContent: {
    margin: "0",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const NextMission = ({ setAlert, logout, getMissions, missions, auth }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen1 = () => {
    setOpen1(true);
  };

  const handleDrawerClose1 = () => {
    setOpen1(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={
          (clsx(
            classes.appBar,

            {
              [classes.appBarShift]: open,
              [classes.appBarShift1]: open1,
            }
          ),
          clsx(classes.appBar1, {
            [classes.appBarShift1]: open1,
            [classes.appBarShift]: open,
          }))
        }
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer1"
            onClick={handleDrawerOpen1}
            edge="start"
            className={clsx(open1 && classes.hide)}
          >
            <img
              alt="DefStream Logo"
              src={DefStreamLogo}
              style={{ width: "30px", height: "auto" }}
            />{" "}
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            DefStream
          </Typography>
          <div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <img
                src={account}
                alt="account"
                style={{ height: 40, width: 40 }}
              />
              {/* <AccountCircleIcon style={{ color: grey[50] }} />{" "} */}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem style={{ pointerEvents: "none" }}>
                <PersonOutlineIcon />
                {auth.user && auth.user.name}
              </MenuItem>
              <Link to="/edit">
                <MenuItem onClick={handleClose}>
                  <SettingsOutlinedIcon /> My account
                </MenuItem>
              </Link>
              <MenuItem onClick={logout}>
                <LogoutIcon /> Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>{" "}
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer1, {
          [classes.drawerOpen1]: open1,
          [classes.drawerClose1]: !open1,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen1]: open1,
            [classes.drawerClose1]: !open1,
          }),
        }}
      >
        {" "}
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose1}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {" "}
          <Link to="/dashboard">
            <ListItem
              title="Missions List"
              onClick={getMissions}
              button
              key="Missions List"
            >
              <ListItemIcon>
                {" "}
                <SubscriptionsIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Missions List" />
            </ListItem>
          </Link>
          {auth.user && auth.user.userType === "admin" ? (
            <Link to="/addmission">
              <ListItem
                title="Add Mission"
                onClick={getMissions}
                button
                key="Add Mission"
              >
                <ListItemIcon>
                  {" "}
                  <QueuePlayNextIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Add Mission" />
              </ListItem>
            </Link>
          ) : (
            ""
          )}
          <Link to="/livemission">
            <ListItem
              title="Live Missions"
              onClick={getMissions}
              button
              key="Live Missions"
            >
              <ListItemIcon>
                {" "}
                <LiveTvIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Live Missions" />
            </ListItem>
          </Link>
          {/* <Link to="/donemission">
          <ListItem button key="Done Missions">
            <ListItemIcon>
              {" "}
              <FastRewindOutlinedIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Done Missions" />
          </ListItem>
              </Link>*/}
          <Link to="/nextmission">
            <ListItem
              title="Next Missions"
              onClick={getMissions}
              button
              key="Next Missions"
            >
              <ListItemIcon>
                {" "}
                <FastForwardOutlinedIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Next Missions" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        {auth.user && auth.user.userType === "admin" ? (
          <List>
            <Link to="/users">
              <ListItem title="Users List" button key="Users List">
                <ListItemIcon>
                  {" "}
                  <GroupOutlinedIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Users List" />
              </ListItem>
            </Link>

            <Link to="/adduser">
              <ListItem title="Add User" button key="Add user">
                <ListItemIcon>
                  {" "}
                  <PersonAddOutlinedIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Add user" />
              </ListItem>
            </Link>
          </List>
        ) : (
          ""
        )}
      </Drawer>

      <main
        className={clsx(classes.content, classes.content1, {
          [classes.contentShift]: open,
        })}
      >
        <div className={(classes.drawerHeader, classes.toolbar)} />
        <Grid item xs={12}>
          {/* There is already an h1 in the page, let's not duplicate it. */}

          <Typography variant="h3" component="h5">
            <Fab color="primary">
              <FastForwardOutlinedIcon />
            </Fab>{" "}
            Next Missions List
          </Typography>
        </Grid>{" "}
        <br />
        <Divider />
        <br />
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-start"
          spacing={1}
        >
          {/* {auth.user && auth.user.userType === "admin" ? (
                    <Link to="/addmission">
                      <Fab
                        variant="extended"
                        size="small"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                      >
                        <AddIcon className={classes.extendedIcon} />
                        Add Mission
                      </Fab>
                    </Link>): (
                      ""
                    )}    */}
        </Grid>
        <br />
        {/* <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
 

          {auth.user && auth.user.userType === "admin"
            ? missions.mission
                .filter(
                  (mission) =>
                    mission.status === "Scheduled" ||
                    mission.status === "Rescheduled"
                )
                .map((mission) => (
                  <Card
                    key={mission.name + auth.user.name.toString()}
                    username={auth.user.name}
                    mission={mission}
                  />
                ))
            : auth.user &&
              auth.user.allowedMissions
                .filter(
                  (allowedMissions) =>
                    allowedMissions.status === "Scheduled" ||
                    allowedMissions.status === "Rescheduled"
                )
                .map((mission) => (
                  <Card
                    key={mission.name + auth.user.name.toString()}
                    username={auth.user.name}
                    mission={mission}
                  />
                ))}
        </Grid> */}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {auth.user && auth.user.userType === "admin" ? (
            missions.mission.filter(
              (mission) =>
                mission.status === "Scheduled" ||
                mission.status === "Rescheduled"
            ).length === 0 ? (
              <Alert
                severity="error"
                className={classes.alignItemsAndJustifyContent}
                variant="outlined"
              >
                There is no mission !
              </Alert>
            ) : (
              missions.mission
                .filter(
                  (mission) =>
                    mission.status === "Scheduled" ||
                    mission.status === "Rescheduled"
                )
                .map((mission) => (
                  <Card
                    key={mission.name + auth.user.name.toString()}
                    username={auth.user.name}
                    mission={mission}
                  />
                ))
            )
          ) : auth.user &&
            auth.user.allowedMissions.filter(
              (mission) =>
                mission.status === "Scheduled" ||
                mission.status === "Rescheduled"
            ).length === 0 ? (
            <Alert
              severity="error"
              className={classes.alignItemsAndJustifyContent}
              variant="outlined"
            >
              There is no mission !
            </Alert>
          ) : (
            auth.user &&
            auth.user.allowedMissions
              .filter(
                (mission) =>
                  mission.status === "Scheduled" ||
                  mission.status === "Rescheduled"
              )
              .map((mission) => (
                <Card
                  key={mission.name + auth.user.name.toString()}
                  username={auth.user.name}
                  mission={mission}
                />
              ))
          )}
        </Grid>
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
      </Drawer>
    </div>
  );
};

NextMission.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getMissions: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  missions: state.missions,
});
export default connect(mapStateToProps, { setAlert, getMissions, logout })(
  NextMission
);
