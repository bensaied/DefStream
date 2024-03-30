import React, { useState } from "react";
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
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import { grey } from "@material-ui/core/colors";
import SubscriptionsIcon from "@material-ui/icons/SubscriptionsOutlined";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Tab from "./Tab";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import DuoOutlinedIcon from "@material-ui/icons/DuoOutlined";
import DefStreamLogo from "./logo.png";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import Video from "./BroadcasterVideo";
import PropTypes from "prop-types";
import { logout } from "../../actions/user";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import account from "../../components/icons/account.jpg";

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
    // necessary for content to be below app bar
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
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content1: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Mission({ setAlert, logout, auth }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

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
        <Toolbar
          style={{
            background: "linear-gradient(to right, #9966cc, #b1defb)",
          }}
        >
          {" "}
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
            Def Stream
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
                style={{ height: 35, width: 35 }}
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
              <MenuItem>
                <PersonOutlineIcon />
                {auth.user && auth.user.name}
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <SettingsOutlinedIcon /> My account
              </MenuItem>
              <MenuItem onClick={logout}>
                <LogoutIcon /> Logout
              </MenuItem>
            </Menu>
          </div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
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
          <a href="/dashboard">
            <ListItem button key="Missions List">
              <ListItemIcon>
                {" "}
                <SubscriptionsIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Missions List" />
            </ListItem>
          </a>
          <ListItem button key="Live Missions">
            <ListItemIcon>
              {" "}
              <LiveTvIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Live Missions" />
          </ListItem>
          <ListItem button key="Done Missions">
            <ListItemIcon>
              {" "}
              <FastRewindOutlinedIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Done Missions" />
          </ListItem>
          <ListItem button key="Next Missions">
            <ListItemIcon>
              {" "}
              <FastForwardOutlinedIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Next Missions" />
          </ListItem>
        </List>
        <Divider />
        {auth.user && auth.user.userType === "admin" ? (
          <List>
            <ListItem button key="Users List">
              <ListItemIcon>
                {" "}
                <GroupOutlinedIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Users List" />
            </ListItem>
            <ListItem button key="Add user">
              <ListItemIcon>
                {" "}
                <PersonAddOutlinedIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Add user" />
            </ListItem>
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

        <Video />
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
        <Tab />
      </Drawer>
    </div>
  );
}
Mission.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,

  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { setAlert, logout })(Mission);
