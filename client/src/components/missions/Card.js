import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Card from "@material-ui/core/Card";
import Card from "@mui/material/Card";

// import ButtonBase from "@material-ui/core/ButtonBase";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { setMission } from "../../actions/mission";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";

import Tooltip from "@material-ui/core/Tooltip";
//import Fab from "@material-ui/core/Fab";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@mui/icons-material/Delete";

//import { ThemeContext } from "@emotion/react";
import "./style.css";
import LIVE from "./Live.png";
import Scheduled from "./scheduled.png";
import Rescheduled from "./Rescheduled.png";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import axios from "axios";

const cardStyle = {
  display: "flex",
  transitionDuration: "0.3s",
  minHeight: "18vw",
  minWidth: "18vw",
  flexGrow: 3,
  flexDirection: "column",
  //alignItems: 'stretch',
  flexWrap: "nowrap",
};

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

function MediaCard({
  auth,
  setmission,
  username,
  setMission,
  missions,
  mission: {
    _id,
    name,
    description,
    image,
    status,
    date,
    broadcaster,
    allowedUsers,
    geolocalisation,
    chat,
  },
}) {
  const classes = useStyles();
  const mission = {
    _id,
    name,
    description,
    image,
    status,
    date,
    broadcaster,
    geolocalisation,
    allowedUsers,
    chat,
  };
  const onClick = (e) => setMission(mission);
  ///////////////////////////////////////////////////////////////////////////////////////Remove Mission
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (missionId) => {
    try {
      await axios.delete(`api/missions/delete/${missionId}`);
    } catch (error) {
      // Handle error
    }
    toggleModal();
    window.location.reload();
  };

  return (
    <Grid item>
      <Dialog open={isOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row-reverse"
          >
            <IconButton onClick={toggleModal}>
              <Close />
            </IconButton>
            <Typography variant="h5">Delete Mission</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography>
            Do you really want to delete mission {mission.name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box display="flex" justifyContent="flex-end" paddingRight={1}>
            <Button variant="contained" onClick={toggleModal}>
              Cancel
            </Button>
            <Box marginLeft={1}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => handleDelete(mission._id)}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </DialogActions>
        <br></br>
      </Dialog>

      <Card className={classes.root} style={cardStyle}>
        {/* <ButtonBase
          onClick={(e) => onClick(e)}
      > */}

        <CardActionArea onClick={(e) => onClick(e)}>
          <CardMedia
            className={classes.media}
            image={"../images/" + image}
            title={name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {
                <a href="/dashboard" style={{ fontWeight: "bold" }}>
                  {" "}
                  {name}{" "}
                </a>
              }
            </Typography>

            {/*<Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>*/}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Typography variant="body2" color="textSecondary" component="p">
            {moment(date).format("YYYY-MM-DD[T]HH:mm:ss")}{" "}
          </Typography>
          <Typography
            align="right"
            display="inline"
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {status === "Live" ? (
              <button name="button1" className="Rec" />
            ) : status === "Scheduled" ? (
              "Scheduled"
            ) : (
              "Rescheduled"
            )}
          </Typography>
          <Typography
            align="right"
            display="inline"
            variant="body2"
            component="p"
          >
            {status === "Live" ? (
              <img src={LIVE} alt="LIVE" style={{ height: 30, width: 40 }} />
            ) : status === "Scheduled" ? (
              <img
                src={Scheduled}
                alt="Scheduled"
                style={{ height: 25, width: 25 }}
              />
            ) : status === "Rescheduled" ? (
              <img
                src={Rescheduled}
                alt="Rescheduled"
                style={{ height: 30, width: 30 }}
              />
            ) : (
              " "
            )}
          </Typography>
        </CardActions>

        <CardActions>
          {" "}
          {mission.status === "Live" ? (
            <Link
              onClick={(e) => (!username || !name ? e.preventDefault() : null)}
              to={`/mission?name=${username}&room=${name}`}
            >
              <Button
                title="Enter mission"
                style={{
                  maxWidth: "60px",
                  maxHeight: "0.05px",
                  minWidth: "60px",
                  minHeight: "0.05px",
                }}
                color="primary"
                onClick={(e) => onClick(e)}
              >
                enter
              </Button>
            </Link>
          ) : (
            " "
          )}
          {/* <Link
            onClick={(e) => (!username || !name ? e.preventDefault() : null)}
            to={`/mission?name=${username}&room=${name}`}
          >
            <Button size="small" color="primary" onClick={(e) => onClick(e)}>
              enter mission
            </Button>
          </Link> */}
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            spacing={1}
          >
            {auth.user &&
            auth.user.userType === "admin" &&
            status === "Live" ? (
              <Tooltip title="Delete mission">
                <IconButton onClick={toggleModal} aria-label="modify">
                  <DeleteIcon color="primary" />
                </IconButton>
              </Tooltip>
            ) : (auth.user &&
                auth.user.userType === "admin" &&
                status === "Scheduled") ||
              (auth.user &&
                auth.user.userType === "admin" &&
                status === "Rescheduled") ? (
              <Link to="/modifymission">
                <Tooltip title="Modify mission">
                  <IconButton onClick={(e) => onClick(e)} aria-label="modify">
                    <CreateIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Link>
            ) : (
              " "
            )}
          </Grid>
        </CardActions>

        {/* </ButtonBase> */}
      </Card>
    </Grid>
  );
}

MediaCard.propTypes = {
  setMission: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  setmission: state.setmission,
  missions: state.missions,
});

export default connect(mapStateToProps, { setMission })(MediaCard);
