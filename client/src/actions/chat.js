import axios from "axios";
import { GET_CHAT, GET_IP, CHAT_ERROR, SET_MESSAGE } from "./types";
import { setAlert } from "./alert";
import https from "https";

// Get mission's Discussion
export const getChat = (mission) => async (dispatch) => {
  try {
    const res = await axios.get("api/chats/message/" + mission, {
      // This configuration was made for disabling SSL verification , in order to get files
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    dispatch({
      type: GET_CHAT,

      // payload: {res.data.messages,res.data.ip },
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: CHAT_ERROR,
    });
  }
};

// Get mission's IP
export const getIP = (mission) => async (dispatch) => {
  try {
    const res = await axios.get("api/chats/ip/" + mission);
    dispatch({
      type: GET_IP,
      // payload: {res.data.messages,res.data.ip },
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: CHAT_ERROR,
    });
  }
};

// Add Message

export const addMessage = (username, text, time, room) => async (dispatch) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  const body = JSON.stringify({ username, text, time, room });

  try {
    const res = await axios.put("api/chats/message/", body, config);
    console.log("Message sent.");
    dispatch({
      type: SET_MESSAGE,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: CHAT_ERROR,
    });
  }
};
