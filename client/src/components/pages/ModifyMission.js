import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
//import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import { grey } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";

import SubscriptionsIcon from "@material-ui/icons/SubscriptionsOutlined";
import LiveTvIcon from "@material-ui/icons/LiveTv";
//import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

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
import { setAlert } from "../../actions/alert";
import Alert from "./Alert";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Moment from "moment";
import { editMission } from "../../actions/mission";
// import axios from 'axios';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import account from "../../components/icons/account.jpg";
import Checkbox from "@material-ui/core/Checkbox";

const drawerWidth = 240;
const drawerWidth0 = 330;

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(20),
    width: "30%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "49.5%",
  },
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
  formControl: {
    width: "100%",
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

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const ModifyMission = ({
  setAlert,
  missions,
  logout,
  auth,
  setmission,
  editMission,
  users,
}) => {
  const classes = useStyles();
  // const theme = useTheme();
  const [open] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [personName, setPersonName] = useState([]);
  // const [value, setValue] = useState(new Date());

  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    status: "",
    date: "",
    broadcaster: "",
    geolocalisation: "",
    allowedUsers: "",
    chat: "",
  });

  const {
    _id,
    name,
    status,
    date,
    broadcaster,
    allowedUsers,
    geolocalisation,
    chat,
  } = formData;

  useEffect(() => {
    setFormData({
      // ...formData,
      _id: setmission.mission && setmission.mission._id,
      name: setmission.mission && setmission.mission.name,
      //description: setmission.mission && setmission.mission.description,
      status: setmission.mission && setmission.mission.status,
      date:
        setmission.mission &&
        Moment(setmission.mission.date).format("YYYY-MM-DD[T]HH:mm:ss"),
      geolocalisation: setmission.mission && setmission.mission.geolocalisation,
      broadcaster: setmission.mission && setmission.mission.broadcaster,
      allowedUsers: setmission.mission && setmission.mission.allowedUsers,
      chat: setmission.mission && setmission.mission.chat,
    });
  }, [setmission]);

  const handleDrawerOpen1 = () => {
    setOpen1(true);
  };

  const handleDrawerClose1 = () => {
    setOpen1(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    editMission(
      _id,
      name,
      status,
      date,
      broadcaster,
      allowedUsers,
      geolocalisation,
      chat
    );
    if (missions.msg === "Mission Edited") {
      missions.redirect = true;
    }
  };

  const [res, setRes] = useState(false);

  if (auth.user && missions.redirect) return <Redirect to="/dashboard" />;

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
              <Link to="edit">
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
            <ListItem button key="Missions List">
              <ListItemIcon>
                {" "}
                <SubscriptionsIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Missions List" />
            </ListItem>
          </Link>
          {auth.user && auth.user.userType === "admin" ? (
            <Link to="/addmission">
              <ListItem button key="Add Mission">
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
            <ListItem button key="Live Missions">
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
            <ListItem button key="Next Missions">
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
              <ListItem button key="Users List">
                <ListItemIcon>
                  {" "}
                  <GroupOutlinedIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Users List" />
              </ListItem>
            </Link>

            <Link to="/adduser">
              <ListItem button key="Add user">
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
              <ModeEditIcon />
            </Fab>{" "}
            {setmission.mission && setmission.mission.name}
          </Typography>
        </Grid>{" "}
        <br />
        <Divider />
        <form
          style={{
            position: "absolute",
            left: "35%",
            top: "10%",
            //transform: "translate(-50%, -50%)",
          }}
          className={classes.form}
          onSubmit={(e) => onSubmit(e)}
          noValidate
        >
          {auth.user &&
          (setmission.mission.status === "Scheduled" ||
            setmission.mission.status === "Rescheduled") ? (
            <Grid container spacing={2}>
              <Alert />
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  defaultValue={setmission.mission && setmission.mission.name}
                  id="Name"
                  label="Name"
                  name="name"
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="status1"
                  label="Current Status"
                  disabled
                  name="status1"
                  defaultValue={setmission.mission.status}
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Status
                  </InputLabel>
                  {(auth.user && setmission.mission.status === "Scheduled") ||
                  "Rescheduled" ? (
                    <Select
                      required
                      labelId="demo-simple-select-outlined-label"
                      id="status"
                      onChange={(e) => onChange(e)}
                      label="Status"
                      name="status"
                      defaultValue={
                        setmission.mission && setmission.mission.status
                      }
                    >
                      <MenuItem
                        value={"Rescheduled"}
                        onClick={() => setRes(true)}
                      >
                        Rescheduled
                      </MenuItem>
                      <MenuItem
                        value={"Canceled"}
                        onClick={() => setRes(false)}
                      >
                        Canceled
                      </MenuItem>
                    </Select>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  disabled={!res}
                  variant="outlined"
                  fullWidth
                  label="Date"
                  type="datetime-local"
                  id="date"
                  defaultValue={
                    setmission.mission &&
                    Moment(setmission.mission.date).format(
                      "YYYY-MM-DD[T]HH:mm:ss"
                    )
                  }
                  name="date"
                  inputProps={{
                    // Only needs the first 16 characters in the date string
                    min: new Date().toISOString().slice(0, 16),
                  }}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Broadcaster
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-outlined-label"
                    id="broadcaster"
                    onChange={(e) => onChange(e)}
                    label="Broadcaster"
                    name="broadcaster"
                    defaultValue={
                      setmission.mission && setmission.mission.broadcaster
                    }
                  >
                    {auth.user &&
                      users.users
                        .filter(
                          (users) =>
                            users.userType ===
                            "broadcaster" /*&& users.allowedMissions==""*/
                        )
                        .map((broadcaster) => (
                          <MenuItem
                            key={Math.random()}
                            value={broadcaster.name}
                          >
                            {" "}
                            {broadcaster.name}{" "}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Allowed Users
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    name="allowedUsers"
                    onChange={handleChange}
                    label="Allowed Users"
                    renderValue={(selected) => selected.join(", ")}
                    defaultValue={
                      setmission.mission && setmission.mission.allowedUsers
                    }
                    //input={<OutlinedInput label="Allowed Users" />}
                    //MENUPROPS is a restricted menu with scrollbar
                    //MenuProps={MenuProps}
                  >
                    {auth.user &&
                      users.users
                        .filter((users) => users.userType === "user")
                        .map((user) => (
                          <MenuItem key={Math.random()} value={user.name}>
                            <Checkbox
                              color="primary"
                              checked={personName.indexOf(user.name) > -1}
                            />
                            <ListItemText primary={user.name} />
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="geolocalisation"
                  label="Localization"
                  name="geolocalisation"
                  defaultValue={
                    setmission.mission && setmission.mission.geolocalisation
                  }
                  onChange={(e) => onChange(e)}
                />
              </Grid>
            </Grid>
          ) : (
            ""
          )}

          <Button
            className={classes.submit}
            type="submit"
            variant="contained"
            color="primary"
            onSubmit={(e) => onSubmit(e)}
          >
            save
          </Button>

          {/* &nbsp; */}
          <Link to="/dashboard">
            <Button
              className={classes.submit}
              variant="contained"
              color="secondary"
            >
              cancel
            </Button>
          </Link>
        </form>
      </main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      ></Drawer>
    </div>
  );
};

ModifyMission.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  missions: state.missions,
  setmission: state.setmission,
  users: state.users,
});
export default connect(mapStateToProps, { setAlert, editMission, logout })(
  ModifyMission
);
