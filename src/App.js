import React from 'react';
import './App.css';
import './components/style/style.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LayoutFile from "./components/LayoutFile";
import ErrorPage from "./components/errorPage";

function App() {
  return (
    <Router>
    <Switch>
      <Route exact path="/" component={LayoutFile} />
    
     
     
      <Route path="/error" component={ErrorPage} />
      <Route component={ErrorPage} />
    </Switch>
  </Router>
  );
}

export default App;
