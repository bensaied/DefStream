import React from "react";
import "./LogFail.css";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  },
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////      Login Fail

function LogFail() {
  const classes = useStyles();

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <Paper variant="outlined">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div id="myModal" className="modal fade">
            <div className="modal-dialog modal-confirm">
              <div className="modal-content">
                <div className="modal-header">
                  <img
                    alt="Caution"
                    src="http://100dayscss.com/codepen/alert.png"
                    width="80"
                    height="70"
                  />
                  <h4 className="modal-title">Sorry !</h4>
                </div>
                <div className="modal-body">
                  <br></br>
                  <p>
                    {" "}
                    <strong>Device credentials are not registered.</strong>
                  </p>
                  <p>
                    {" "}
                    <strong>
                      Verify with the administrator and refresh the page.
                    </strong>
                  </p>
                </div>
                <br></br>

                <div className="modal-footer">
                  {/* <button onClick={refreshPage} className="btn btn-info" data-dismiss="modal">Close</button>  */}
                  <Button
                    color="primary"
                    onClick={refreshPage}
                    variant="contained"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <form className={classes.form} noValidate></form>
        </div>
      </Container>
    </Paper>
  );
}

export default LogFail;
