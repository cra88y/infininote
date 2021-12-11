import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ApplicationPage from "./components/ApplicationPage";
import Filter from "react-css-filter";
function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const userTheme = useSelector((state) => state.session.theme);
  const userIsDark = useSelector((state) => state.session.dark);
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (sessionUser) history.push("/client");
  }, [sessionUser]);

  return (
    <>
      <Filter
        effects={{
          "hue-rotate": `${userTheme}deg`,
        }}
      >
        {/* <Filter
          effects={{
            invert: `${userIsDark ? "95%" : "0%"}`,
            "hue-rotate": `${userIsDark ? "180deg" : "0deg"}`,
          }}
        > */}
        <Navigation isLoaded={isLoaded} />
        {isLoaded && (
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route path="/client">
              <ApplicationPage />
            </Route>
          </Switch>
        )}
        {/* </Filter> */}
      </Filter>
    </>
  );
}

export default App;
