import { GET_USERS, GET_USERS_ERROR } from "../actions/types";

const initialState = {
  users: [],
  error: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
////////////////////////////////////////////////////////////////GET-USERS
case GET_USERS:

  return {
    ...state,
    users: payload,
  };

////////////////////////////////////////////////////////////////GET-USERS-ERRORS  
case GET_USERS_ERROR:
    return {
      error: "Problem to fetch"
  };

default:
      return state;
  }
}
