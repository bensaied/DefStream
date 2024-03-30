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
// import FormHelperText from '@material-ui/core/FormHelperText'
// import { useHistory } from "react-router-dom";

import SubscriptionsIcon from "@material-ui/icons/SubscriptionsOutlined";
import LiveTvIcon from "@material-ui/icons/LiveTv";
//import FastRewindOutlinedIcon from "@material-ui/icons/FastRewindOutlined";
import FastForwardOutlinedIcon from "@material-ui/icons/FastForwardOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
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
import { setAlert } from "../../actions/alert";
import Alert from "./Alert";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
// import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import { addMission } from "../../actions/mission";
import { getMissions } from "../../actions/mission";

//import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from "@material-ui/core/Checkbox";

// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Moment from "moment";
import account from "../../components/icons/account.jpg";

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

//   const [res, setRes] = useState(false);
//   const test = () => {
// if (setRes =="True") {res=1;}
//   }

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

const AddMission = ({
  setAlert,
  addMission,
  getMissions,
  logout,
  auth,
  users,
  missions,
}) => {
  // constructor(props) {
  //   super(props);
  //   this.state = { value: 0 };
  // }

  const classes = useStyles();
  // const theme = useTheme();
  const [open] = useState(false);
  const [open1, setOpen1] = useState(false);

  // const handleChangeCountry = (event) => {
  //    setSelectedCountry(event.target.value);
  //  };

  // const [currentImage, setCurrentImage] = useState(0);
  // const [viewerIsOpen, setViewerIsOpen] = useState(false);

  // const openLightbox = useCallback((event, { photo, index }) => {
  //   setCurrentImage(index);
  //   setViewerIsOpen(true);
  // }, []);

  // const closeLightbox = () => {
  //   setCurrentImage(0);
  //   setViewerIsOpen(false);
  // };

  const [personName, setPersonName] = useState([]);
  const [value, setValue] = useState(new Date());

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

  // const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    broadcaster: "",
    allowedUsers: "",
    date: "",
    status: "Scheduled",
    geolocalisation: "",
    image: "",
  });

  const {
    name,
    description,
    // date,
    status,
    geolocalisation,
    // image,
    broadcaster,
  } = formData;

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////Upload Images
  // const [file, setFile] = useState();
  // const [fileName, setFileName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    let allowedUsers = personName;
    let num = [Math.floor(Math.random() * 50)];
    let pic = "img" + num[0] + ".jpg";
    let image = pic;
    let date = Moment(value).format("YYYY-MM-DD HH:mm");
    addMission({
      name,
      description,
      date,
      status,
      geolocalisation,
      image,
      broadcaster,
      allowedUsers,
    });
    if (missions.msg === "Mission Added") {
      missions.redirect = true;
    }

    //
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

  /////////////////////////////////////////// Redirect After adding Mission and updating pic

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
                <QueuePlayNextIcon />
              </Fab>{" "}
              Add new mission
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
                  id="name"
                  label="Name"
                  name="name"
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  minRows={2}
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="status"
                  label="Status"
                  disabled
                  name="status"
                  defaultValue={"Scheduled"}
                  onChange={(e) => onChange(e)}
                />
              </Grid>

              {/* <Grid item xs={12} >
              <TextField
                required
                variant="outlined"
                fullWidth
                label="Date"
                name="date"
                type="datetime-local"
                id="date"
                format="MM-DD-YYYY HH:mm"
                inputProps={{
                  // Only needs the first 16 characters in the date string
                  min: new Date().toISOString().slice(0, 16),
                }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => onChange(e) }
                />
            </Grid> */}

              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    item
                    xs={12}
                  >
                    <DateTimePicker
                      required
                      renderInput={(params) => {
                        return <TextField variant="outlined" {...params} />;
                      }}
                      id="date"
                      name="date"
                      label="Date"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      minDate={Date.now()}
                    />
                  </LocalizationProvider>
                </FormControl>
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
                    label="broadcaster"
                    name="broadcaster"
                    value={broadcaster}
                  >
                    {auth.user &&
                      users.users
                        .filter(
                          (users) =>
                            users.userType == "broadcaster" &&
                            users.allowedMissions == ""
                        )
                        .map((broadcaster) => (
                          <MenuItem key={Math.random()} value={broadcaster}>
                            {" "}
                            {broadcaster.name}{" "}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Allowed users
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  onChange={(e) => onChange(e)}
                  label="allowedUsers"
                  name="allowedUsers"
                >
                     {auth.user && (users.users.filter(users => users.userType == "user")).map((user, i) => (
               <MenuItem key={user} value = {user}> {user.name} </MenuItem>
                ))}
                </Select>
              </FormControl>
            </Grid> */}

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Allowed Users
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    label="Allowed Users"
                    renderValue={(selected) => selected.join(", ")}
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
                  onChange={(e) => onChange(e)}
                />
              </Grid>
            </Grid>

            <Button
              className={classes.submit}
              type="submit"
              variant="contained"
              color="primary"
              onSubmit={(e) => onSubmit(e)}
            >
              Add
            </Button>

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

AddMission.propTypes = {
  setAlert: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  addMission: PropTypes.func.isRequired,
  getMissions: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.users,
  missions: state.missions,
});
export default connect(mapStateToProps, {
  setAlert,
  logout,
  getMissions,
  addMission,
})(AddMission);
