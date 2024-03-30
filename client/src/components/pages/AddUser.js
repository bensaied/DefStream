import React, { useState } from "react";
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
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
import Alert from "./Alert";
import { setAlert } from "../../actions/alert";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import account from "../../components/icons/account.jpg";
import { addUser } from "../../actions/user";

import {
  // Stack,
  InputAdornment,
} from "@material-ui/core";
//import setmission from "../../reducers/setmission";

////////////////////////////////////////////////////////////////////////////// Importing Dongle Functions
/*import {
  getId,
  openDevice,
  getSecret,
  getVersion,
} from "../../usb_driver/webUsb";*/

const drawerWidth = 240;
const drawerWidth0 = 330;
const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
    //  marginRight: 36,
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

/*function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}*/

/////////////////////////////////////////////////////////////////////////////////////////////////////      Add User Logic
const AddUser = ({ addUser, setAlert, logout, auth, missions }) => {
  //////show password state
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  //////

  /////Dongle connect button consts
  // {
  //   /*const [isConnecting, setConnecting] = useState(false);
  // const [USBauth, setUSBauth] = useState(false);
  // let onClick1;*/
  // }
  /////

  const classes = useStyles();
  // const theme = useTheme();
  const [open] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    userType: "",
    password: "Def$tre0m",
    location: "",
    productId: "",
    secret: "",
    //allowedMissions: ""
  });
  const {
    name,
    username,
    password,
    userType,
    location,
    productId,
    secret /*, allowedMissions*/,
  } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    addUser({
      name,
      username,
      password,
      userType,
      location,
      productId,
      secret /*, allowedMissions*/,
    });
    if (auth.msg === "User Added") {
      auth.redirect = true;
    }
  };

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleShowPassword1 = () => {
    setShowPassword1((show) => !show);
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

  /////////////////////////////////////////////// Button connect to a dongle depandancies
  //   {
  //     /*} useEffect(() => {
  //     if (isConnecting) {
  //       simulateNetworkRequest().then(() => {
  //         setConnecting(false);
  //       });
  //     }
  //   }, [isConnecting]);
  //   const handleClick1 = () => setConnecting(true);

  //   onClick1 = async (e) => {
  //     if (auth.id) {
  //       try {

  //         const device = await openDevice();
  //         const productId = await getId(device);
  //         console.log("This is the PiD of the dongle selected",productId);

  //         const secret = await getSecret(device);
  //         console.log("This is the secret of the dongle selected",secret);

  //       } catch {}
  //     }
  //   };
  // */
  //   }

  /////////////////////////////////////////// Redirect After adding user

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

      {auth.user && auth.user.userType === "admin" ? (
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
                <PersonAddIcon />
              </Fab>{" "}
              Add new user
            </Typography>
          </Grid>{" "}
          <br />
          <Divider />
          <form
            style={{
              position: "absolute",
              left: "35%",
              top: "10%",
              //  transform: "translate(-50%, -50%)",
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
                  id="name"
                  autoComplete="name"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => onChange(e)}
                />
              </Grid>{" "}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
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
                    required
                    name="userType"
                    value={userType}
                  >
                    <MenuItem value={"user"}>User</MenuItem>
                    <MenuItem value={"broadcaster"}>Broadcaster</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  id="password"
                  label="Password"
                  name="password"
                  value={password}
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
                  required
                  variant="outlined"
                  fullWidth
                  id="productId"
                  label="Product ID"
                  name="productId"
                  value={productId}
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  variant="outlined"
                  fullWidth
                  id="secret"
                  type={showPassword1 ? "text" : "password"}
                  label="Secret"
                  name="secret"
                  value={secret}
                  onChange={(e) => onChange(e)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword1} edge="end">
                          <Icon icon={showPassword1 ? eyeFill : eyeOffFill} />
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
                  id="location"
                  label="Location"
                  name="location"
                  value={location}
                  onChange={(e) => onChange(e)}
                />
              </Grid>
            </Grid>

            {/*<Button
             variant="primary"
             disabled={isConnecting}
             onClick= {onClick1()}
          >
             {isConnecting ? 'Adding a dongle...' : 'Add a dongle to this user'}
          </Button>*/}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onSubmit={(e) => onSubmit(e)}
            >
              Add
            </Button>
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
      ) : (
        ""
        //  history.push("/404")
      )}

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

AddUser.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  missions: state.missions,
});
export default connect(mapStateToProps, { addUser, setAlert, logout })(AddUser);
