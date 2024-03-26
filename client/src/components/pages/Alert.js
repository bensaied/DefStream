import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert1 from "@material-ui/lab/Alert";

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <Alert1
      variant="filled"
      severity={alert.alertType === "danger" ? "error" : null}
      key={Math.random()}
    >
      {alert.msg}
    </Alert1>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
