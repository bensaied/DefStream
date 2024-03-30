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
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

import SubscriptionsIcon from "@material-ui/icons/SubscriptionsOutlined";
import LiveTvIcon from "@material-ui/icons/LiveTv";
// import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
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
import { logout, updateUser } from "../../actions/user";
import { setAlert } from "../../actions/alert";
import Alert from "./Alert";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
//import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
//import Moment from "moment";
import { InputAdornment } from "@material-ui/core";
// import Checkbox from "@material-ui/core/Checkbox";
import account from "../../components/icons/account.jpg";

const drawerWidth = 240;
const drawerWidth0 = 330;

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

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
  // menuButton: {
  //   marginRight: 36,
  // },
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

const ModifyUser = ({
  setAlert,
  updateUser,
  logout,
  auth,
  users,
  setuser,
  setmission,
  missions,
}) => {
  const classes = useStyles();
  // const theme = useTheme();
  const [open] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [showPassword1, setShowPassword1] = useState(false);

  // const [setPersonName] = useState([]);

  // const handleChange = (e) => {
  //   const {
  //     target: { value },
  //   } = e;
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    username: "",
    userType: "",
    location: "",
    allowedMissions: "",
    resetpassword: "",
  });

  const {
    _id,
    name,
    username,
    userType,
    location,
    allowedMissions,
    resetpassword,
  } = formData;

  useEffect(() => {
    setFormData({
      // ...formData,
      _id: setuser.user && setuser.user._id,
      name: setuser.user && setuser.user.name,
      username: setuser.user && setuser.user.username,
    });
  }, [setuser]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

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
    updateUser(
      _id,
      name,
      username,
      userType,
      location,
      allowedMissions,
      resetpassword
    );
    if (auth.msg === "User Edited") {
      auth.redirect = true;
    }
  };

  /////////////////////////////////////////// Redirect After editing user

  if (auth.user && auth.redirect) return <Redirect to="/users" />;

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
          <Link to="/addmission">
            <ListItem button key="Add Mission">
              <ListItemIcon>
                {" "}
                <QueuePlayNextIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Add Mission" />
            </ListItem>
          </Link>
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
            {setuser.user && setuser.user.name}
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
          <Grid container spacing={2}>
            <Alert />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                defaultValue={setuser.user && setuser.user.name}
                id="name"
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
                defaultValue={setuser.user && setuser.user.username}
                id="username"
                label="Username"
                name="username"
                onChange={(e) => onChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="userType"
                  onChange={(e) => onChange(e)}
                  label="Type"
                  type="userType"
                  name="userType"
                  defaultValue={setuser.user && setuser.user.userType}
                >
                  <MenuItem value={"user"}>User</MenuItem>
                  <MenuItem value={"broadcaster"}>Broadcaster</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                id="password"
                label="Reset Password"
                type={showPassword ? "text" : "password"}
                name="resetpassword"
                onChange={(e) => onChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                onChange={(e) => onChange(e)}
                id="standard-multiline-static1"
                label="Location"
                name="location"
                defaultValue={setuser.user && setuser.user.location}
                minRows={4}
              />
            </Grid>

            {/* <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                      <InputLabel id="demo-multiple-checkbox-label">Allowed Missions</InputLabel>
                                            <Select
                                              labelId="demo-multiple-checkbox-label"
                                              id="demo-multiple-checkbox"
                                              multiple
                                              name="allowedMissions"
                                              onChange={handleChange}
                                              label="Allowed Missions"
                                              renderValue={(selected) => selected.join(', ')}                                              
                                              defaultValue={setuser.user && setuser.user.allowedMissions}                                   
                                              //input={<OutlinedInput label="Allowed Users" />}
                                              //MENUPROPS is a restricted menu with scrollbar
                                              //MenuProps={MenuProps}
                                            >


                                

                                        {auth.user &&  missions.mission.map((k, i) => (
                                                <MenuItem key={k} value={k.name}>
                                                  <Checkbox color="primary" checked={personName.indexOf(k.name) > -1} />
                                                  <ListItemText primary={k.name} />
                                                </MenuItem>
                                              ))}

                                            </Select>
                              </FormControl>
              </Grid> */}

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="standard-multiline-static"
                label="Allowed Missions"
                defaultValue={setuser.user && setuser.user.allowedMissions}
                disabled
                multiline
                minRows={2}
              />
            </Grid>
          </Grid>

          <Button
            className={classes.submit}
            type="submit"
            variant="contained"
            color="primary"
          >
            save
          </Button>

          {/* &nbsp; */}
          <Link to="/users">
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

ModifyUser.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.users,
  setuser: state.setuser,
  missions: state.missions,
});
export default connect(mapStateToProps, { setAlert, updateUser, logout })(
  ModifyUser
);
