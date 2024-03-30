import axios from "axios";
//import { push } from "react-router-redux";
import {
  // ADD_SUCCESS,
  // ADD_FAIL,
  LOGIN_FAIL,
  LOGIN_FAIL1,
  LOGIN1_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  USER_LOADED,
  IP_DETECT,
  USER_ERROR,
  CHANGE_PASSWORD,
  CHANGE_FAIL,
  EDIT_ERROR,
  EDIT_PROFILE,
  ADD_USER,
  ////////////GET-USERS
  GET_USERS,
  GET_USERS_ERROR,
  ////////////SET-USERS
  SET_USER,
  SET_USER_ERROR,
  ///////////EDIT-USERS
  EDIT_USER,
  EDIT_USER_ERROR,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../reducers/utils/setAuthToken";
import { getMissions } from "./mission";

///////////////////////////////////////////////////////////////////////////////////////////////////  ADD User

export const addUser =
  ({
    name,
    username,
    password,
    userType,
    location,
    /*, allowedMissions*/
  }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    const body = JSON.stringify({
      name,
      username,
      password,
      userType,
      location,

      /*, allowedMissions*/
    });

    try {
      const res = await axios.post("/api/users", body, config);
      dispatch({
        type: ADD_USER,
        payload: res.data,
      });
      dispatch(getUsers());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: USER_ERROR,
      });
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////  Load User informations AFTER LOG IN

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("api/users/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
    dispatch(getUsers());
    dispatch(getMissions());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////  Login 1 User (DONGLE)
// export const login1 = (productId, usbtoken) => async (dispatch) => {
//   const config = {
//     headers: {
//       "content-type": "application/json",
//     },
//   };
//   const secret = usbtoken;
//   const body = JSON.stringify({ productId, secret });

//   try {
//     const res = await axios.post("api/users/auth", body, config);

//     dispatch({
//       type: LOGIN1_SUCCESS,
//       payload: res.data,
//     });
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
//     }

//     dispatch({
//       type: LOGIN_FAIL1,
//     });
//   }
// };

///////////////////////////////////////////////////////////////////////////////////////////////////  Login User (EMAIL & PWD)
export const login = (username, password) => async (dispatch) => {
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post("api/users/auth/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////  Change Pwd after 1st Connect
export const changePassword =
  (newpassword, oldpassword, confirmpassword) => async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const firstConnect = false;
    const body = JSON.stringify({
      oldpassword,
      newpassword,
      confirmpassword,
      firstConnect,
    });

    try {
      const res = await axios.put("api/users/me", body, config);

      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: CHANGE_FAIL,
      });
    }
  };

/////////////////////////////////////////////////////////////////////////////////////////////////// PUT IP ADDRESS
// export const detectIP =
//   ({ ip }) =>
//   async (dispatch) => {
//     const config = {
//       headers: {
//         "content-type": "application/json",
//       },
//     };
//     const body = JSON.stringify({});

//     try {
//       const res = await axios.put("api/users/ip", body, config);

//       dispatch({
//         type: IP_DETECT,
//         payload: res.data,
//       });
//     } catch (err) {
//       const errors = err.response.data.errors;

//       if (errors) {
//         errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
//       }
//     }
//   };
export const detectIP = (ip) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({ ip });

    try {
      await axios.put("api/users/ip", body, config);

      dispatch({
        type: IP_DETECT,
        payload: ip.ip,
      });
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////// UPDATE USER PROFILE
export const updateUser =
  (_id, name, username, userType, location, allowedMissions, resetpassword) =>
  async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({
      _id,
      name,
      username,
      userType,
      location,
      allowedMissions,
      resetpassword,
    });

    try {
      const res = await axios.put("api/users/edit", body, config);

      dispatch({
        type: EDIT_USER,
        payload: res.data,
      });
      dispatch(getUsers());
      dispatch(getMissions());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: EDIT_USER_ERROR,
      });
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////  EDIT OWN ACCOUNT
export const editUser =
  (
    name,
    /*email,*/ oldpassword,
    newpassword,
    confirmpassword,
    location,
    allowedMissions
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({
      name,
      //email,
      oldpassword,
      newpassword,
      confirmpassword,
      location,
      allowedMissions,
    });

    try {
      const res = await axios.put("api/users/myaccount", body, config);

      dispatch({
        type: EDIT_PROFILE,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: EDIT_ERROR,
      });
    }
  };

/////////////////////////////////////////////////////////////////////////////////////////////////////// GET ALL USERS

export const getUsers = () => async (dispatch) => {
  try {
    const res = await axios.get("api/users/all");

    dispatch({
      type: GET_USERS,
      payload: res.data,
    });
    dispatch(getMissions());
  } catch (err) {
    dispatch({
      type: GET_USERS_ERROR,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////// SET USERS

export const setUser = (user) => async (dispatch) => {
  try {
    dispatch({
      type: SET_USER,
      payload: user,
    });
  } catch (err) {
    dispatch({
      type: SET_USER_ERROR,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////  LOGOUT

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
