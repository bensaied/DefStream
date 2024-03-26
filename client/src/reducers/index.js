import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import missions from "./missions";
import chat from "./chat";
import users from "./users";
import setmission from "./setmission";
import setuser from "./setuser";

export default combineReducers({
  alert,
  auth,
  missions,
  setmission,
  chat,
  users,
  setuser
});
