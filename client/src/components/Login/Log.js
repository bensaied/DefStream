import React, { useState } from "react";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { login } from "../../actions/user";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../pages/Alert";
import "./Log.css";

import { InputAdornment } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import DefStreamLogo from "./favicon.png";
import { styled } from "@mui/material/styles";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    backgroundColor: "grey",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    //opacity:0.52,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 4),
    // backgroundColor: 'RoyalBlue'
  },
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(lightBlue[900]),
  backgroundColor: lightBlue[900],
  "&:hover": {
    backgroundColor: lightBlue[700],
  },
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////      Add Login

function SignIn({ setAlert, login, auth }) {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // let usbId;
    // if (auth.id) usbId = auth.id;
    // console.log(usbId);
    login(username, password);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  /////////////////////////////////////////// Redirect of logged in
  if (auth.isAuthenticated && !auth.loading) {
    if (auth.user && auth.user.firstConnect)
      return <Redirect to="/changepassword" />;
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="form-box">
        <p>
          <img
            alt="DefStream Logo"
            src={DefStreamLogo}
            style={{ width: "210px", height: "auto" }}
          />{" "}
        </p>
        <Typography
          style={{ fontWeight: 600 }}
          variant="h6"
          color="textPrimary"
        >
          {/* {" "}
          DefStream{" "} */}
        </Typography>

        {/* <Typography component='h1' variant='h5' align='center'>
        DefStream
       </Typography> */}

        {/* <Typography component='h1'>
          Please enter your username and password.
        </Typography>
         */}
        <Alert />

        <form className={classes.form} onSubmit={(e) => onSubmit(e)} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            value={username}
            label="Username"
            onChange={(e) => onChange(e)}
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
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
            autoComplete="current-password"
          />
          <br></br>
          <br></br>
          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onSubmit={(e) => onSubmit(e)}
          >
            Sign In
          </Button> */}
          <ColorButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onSubmit={(e) => onSubmit(e)}
          >
            Sign In
          </ColorButton>
        </form>
      </div>
    </Container>
  );
}
SignIn.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,

  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { setAlert, login })(SignIn);
