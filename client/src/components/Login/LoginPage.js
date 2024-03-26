import React, { useState } from "react";
import Log from "./Log";
import LogFail from "./LogFail";
import { getId, openDevice, getSecret } from "../../usb_driver/webUsb";
import video from "./video.mp4";
import Slide from "@material-ui/core/Slide";
import "./login.css";
import { login1 } from "../../actions/user";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { totp } from "otplib";
// import { render } from "react-dom";
import Alert from "../pages/Alert";
import { setAlert } from "../../actions/alert";

const Login = ({ setAlert, login1, id, auth }) => {
  // const [USBauth, setUSBauth] = useState(false);
  let onClick;
  const [value, setValue] = useState(0);
  totp.options = {
    // step: 30,
  };
  onClick = async (e) => {
    if (!id) {
      try {
        const device = await openDevice();

        const productId = await getId(device);
        //console.log("This is the ProductID:", productId);

        // const version = await getVersion(device);
        // console.log("This is the device's name:",version);

        const secret = await getSecret(device);
        //console.log("This is the secret'value stored in the device:",secret)

        const secretSliced = await secret.slice(0, 8);
        //console.log("This is the value of the secret sliced:", secretSliced);

        //const token = await totp.generate(secretSliced);
        //console.log("This is the token:",token);
        await login1(productId, secretSliced);
      } catch {}
    }
  };

  return (
    <div>
      <section className="showcase">
        <div className="video-container" onClick={(e) => onClick()}>
          <Alert />
          <video src={video} autoPlay muted loop />
        </div>

        {id && auth.msg === "Device Accepted!" ? (
          <Slide direction="down" in={true} style={{ zIndex: 3 }}>
            <div className=" animated fadeInDown animatedfadeInDown ">
              <Log />{" "}
            </div>
          </Slide>
        ) : (
          <Slide
            direction="down"
            in={auth.msg === "Device Not Accepted!"}
            style={{ zIndex: 3 }}
          >
            <div className=" animated fadeInDown animatedfadeInDown ">
              <LogFail />{" "}
            </div>
          </Slide>
        )}
        {/* <Slide direction='down' in={id} style={{ zIndex: 3 }}>    
                    <div className=' animated fadeInDown animatedfadeInDown '>         
                      <Log />{" "}
                    </div>
                </Slide> */}
      </section>
    </div>
  );
};
Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login1: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  id: state.auth.id,
  auth: state.auth,
});

export default connect(mapStateToProps, { setAlert, login1 })(Login);
