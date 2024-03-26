import { SET_MESSAGE, GET_CHAT, GET_IP, CHAT_ERROR } from "../actions/types";

const initialState = {
  chat: null,
  error: null,
  message: null,
  ip: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CHAT:
      return {
        ...state,
        chat: payload,
        message: null,
        error: null,
      };
    case GET_IP:
      return {
        ...state,
        ip: payload,
        message: null,
        error: null,
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: payload,
        error: null,
      };

    case CHAT_ERROR:
      return {
        ...state,
        chat: null,
        error: payload,
      };
    default:
      return state;
  }
}
