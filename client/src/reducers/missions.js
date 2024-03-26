import {
  EDIT_MISSION,
  ADD_MISSION,
  GET_ALL_MISSIONS,
  GET_MISSIONS_ERROR,
  AUTO_CHANGE,
  AUTO_CHANGE_ERROR,
  /*DELETE_MISSION, DELETE_MISSION_ERROR,*/ MISSION_ERROR,
} from "../actions/types";

const initialState = {
  mission: [],
  error: null,
  msg: null,
  ip: null,
  redirect: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    ////////////////////////////////////////////////////////////////GET-MISSIONS
    case GET_ALL_MISSIONS:
      return {
        ...state,
        mission: payload,
        msg: null,
        redirect: false,
        //ip: state.ip,
      };
    ////////////////////////////////////////////////////////////////GET-MISSIONS-ERRORS
    case GET_MISSIONS_ERROR:
      return {
        error: "Problem to fetch",
      };
    ////////////////////////////////////////////////////////////////ADD-MISSION
    case ADD_MISSION:
      return {
        ...state,
        msg: "Mission Added",
        redirect: true,
      };
    //////////////////////////////////////////////////////////////EDIT-MISSION
    case EDIT_MISSION:
      return {
        ...state,
        msg: "Mission Edited",
        redirect: true,
      };

    case AUTO_CHANGE:
      return {
        ...state,
      };

    case AUTO_CHANGE_ERROR:
      return {
        ...state,
      };

    /*case DELETE_MISSION:
      return {
          ...state,


       }

   case  DELETE_MISSION_ERROR:
      return {
          ...state,

          
       }*/

    case MISSION_ERROR:
      return {
        error: "Problem in Mission",
      };

    default:
      return state;
  }
}
