import {
  USER_LOADED,
  IP_DETECT,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_FAIL1,
  LOGOUT,
  LOGIN1_SUCCESS,
  CHANGE_PASSWORD,
  CHANGE_FAIL,
  EDIT_ERROR,
  EDIT_PROFILE,
  //ADD_FAIL,
  //ADD_SUCCESS,
  ADD_USER,
  EDIT_USER,
  //EDIT_USER_ERROR,
  GET_USERS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  id: null,
  error: null,
  redirect: false,
  msg: null,
  ip: null,
};

// Verify the register of the user
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        msg: "User Loaded",
        redirect: true,
        user: payload,
      };
    case IP_DETECT:
      return {
        ...state,
        ip: payload,
        msg: "IP Detected",
      };
    case CHANGE_PASSWORD:
    case EDIT_PROFILE:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        msg: "Profile Edited",
        redirect: true,
      };
    case LOGIN1_SUCCESS:
      return {
        ...state,
        id: payload,
        msg: "Device Accepted!",
        loading: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGIN_FAIL1:
      return {
        ...state,
        msg: "Device Not Accepted!",
      };
    case LOGIN_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        id: null,
      };
    case CHANGE_FAIL:
    case EDIT_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case ADD_USER:
      return {
        ...state,
        msg: "User Added",
        redirect: true,
      };
    case EDIT_USER:
      return {
        ...state,
        msg: "User Edited",
        redirect: true,
      };
    case GET_USERS:
      return {
        ...state,
        msg: null,
        redirect: false,
      };

    default:
      return state;
  }
}
