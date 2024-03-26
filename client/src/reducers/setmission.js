import { SET_MISSION, MISSION_ERROR } from "../actions/types";

const initialState = {
    mission: [],
    error: null,
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SET_MISSION:
        return {
          ...state,
          mission: payload,
          error: null,
        };

    case MISSION_ERROR:{
      return{
        ...state,
        error: payload,
      };
    }

    default:
            return state;
    }
  }
      