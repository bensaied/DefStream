import {
  MISSION_ERROR,
  SET_MISSION,
  ADD_MISSION,
  GET_ALL_MISSIONS,
  EDIT_MISSION,
  GET_MISSIONS_ERROR,
  AUTO_CHANGE,
  AUTO_CHANGE_ERROR /*, DELETE_MISSION , DELETE_MISSION_ERROR*/,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import { getUsers } from "./user";

/////////////////////////////////////////////////////////////// SET MISSION
export const setMission = (mission) => async (dispatch) => {
  try {
    dispatch({
      type: SET_MISSION,
      payload: mission,
    });
  } catch (err) {
    dispatch({
      type: MISSION_ERROR,
    });
  }
};

//////////////////////////////////////////////////////////////// ADD MISSION
export const addMission =
  ({
    name,
    description,
    date,
    status,
    geolocalisation,
    image,
    broadcaster,
    allowedUsers,
  }) =>
  async (dispatch) => {
    const config = {
      headers: { "Content-type": "application/json" },
    };
    const body = JSON.stringify({
      name,
      description,
      date,
      status,
      geolocalisation,
      image,
      broadcaster,
      allowedUsers,
    });
    try {
      const res = await axios.post("/api/missions", body, config);

      dispatch({
        type: ADD_MISSION,
        payload: res.data,
      });
      dispatch(getMissions());
      dispatch(getUsers());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({ type: MISSION_ERROR });
      dispatch(getMissions());
    }
  };

//////////////////////////////////////////////////////////// GET MISSIONS

export const getMissions = () => async (dispatch) => {
  try {
    const res = await axios.get("api/missions/all");

    dispatch({
      type: GET_ALL_MISSIONS,
      payload: res.data,
    });
    dispatch(changeStatus(res.data));
  } catch (err) {
    dispatch({
      type: GET_MISSIONS_ERROR,
    });
  }
};

///////////////////////////////////////////////////////////  CHANGE STATUS
export const changeStatus =
  (
    /*_id, name, description, image, status, date, broadcaster, geolocalisation*/ missions
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({ missions });

    try {
      const res = await axios.put("api/missions/autoChange", body, config);

      dispatch({
        type: AUTO_CHANGE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: AUTO_CHANGE_ERROR,
      });
    }
  };

///////////////////////////////////////////////////////////  EDIT MISSION
export const editMission =
  (
    _id,
    name,
    /*image,*/ status,
    date,
    /*description, */ broadcaster,
    allowedUsers,
    geolocalisation,
    chat
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({
      _id,
      name,
      /*description, image,*/ status,
      date,
      broadcaster,
      allowedUsers,
      geolocalisation,
      chat,
    });

    try {
      const res = await axios.put("api/missions/edit", body, config);

      dispatch({
        type: EDIT_MISSION,
        payload: res.data,
      });
      dispatch(getUsers());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: MISSION_ERROR,
      });
    }
  };
//////////////////////////////////////////////////////////// Delete MISSION

/*export const deleteMission = (_id) => async (dispatch) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  const body = JSON.stringify( _id );
  try {
    const res = await axios.delete("api/missions/delete/"+_id, body, config);

    dispatch({
      type: DELETE_MISSION,
      payload: res.data,
    });
  
  } catch (err) {
    dispatch({
      type: DELETE_MISSION_ERROR,
    });
  }
};
*/
