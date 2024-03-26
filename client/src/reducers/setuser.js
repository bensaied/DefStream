import { SET_USER, SET_USER_ERROR } from "../actions/types";

const initialState = {
    user: [],
    error: null,
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SET_USER:
        return {
          ...state,
          user: payload,
          error: null,
        };

    case SET_USER_ERROR:
      return{
        ...state,
        error: payload,
      }

    default:
            return state;
    }
  }
      