import React from 'react'
import {Route, Switch } from "react-router";
import DetailsPage from "./pages/DetailsPage";
import LandingPage from "./pages/LandingPage";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <Route path="/details/:username/:repositoryName/:icon/:color" exact component={DetailsPage} />
    </Switch>
  )
}
 