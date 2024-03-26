import React, { useEffect, Fragment } from "react";
import Cards from "./components/missions/Cards";
import Mission from "./components/missions/Mission";
import LiveMission from "./components/missions/LiveMission";
import NextMission from "./components/missions/NextMission";
import Broadcaster from "./components/missions/MissionBroadcatser";
import Login from "./components/Login/LoginPage";
import NotFound from "./components/missions/NotFound";
import ChangePassword from "./components/pages/ChangePassword";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import setAuthToken from "./reducers/utils/setAuthToken";
import store from "./store";
import PrivateRoute from "./components/routing/PrivateRoute";
import ChangePaswwordRoute from "./components/routing/ChangePaswwordRoute";
import AddMission from "./components/pages/AddMission";
import ModifyMission from "./components/pages/ModifyMission";
import ModifyUser from "./components/pages/ModifyUser";
import EditUser from "./components/pages/EditUser";
import AddUser from "./components/pages/AddUser";
import UsersList from "./components/pages/UsersList";
import { loadUser } from "./actions/user";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Fragment>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Cards} />
            <PrivateRoute path="/mission" component={Mission} />
            <PrivateRoute path="/livemission" component={LiveMission} />
            <PrivateRoute path="/nextmission" component={NextMission} />
            <PrivateRoute path="/addmission" component={AddMission} />
            <PrivateRoute path="/Modifymission" component={ModifyMission} />
            <PrivateRoute path="/Modifyuser" component={ModifyUser} />
            <PrivateRoute path="/adduser" component={AddUser} />
            <PrivateRoute path="/edit" component={EditUser} />
            <PrivateRoute path="/users" component={UsersList} />
            <PrivateRoute exact path="/broadcast" component={Broadcaster} />

            <ChangePaswwordRoute
              exact
              path="/changepassword"
              component={ChangePassword}
            />
            <PrivateRoute path="/404" component={NotFound} />
            <PrivateRoute path="/*" component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    </Fragment>
  );
};
export default App;
