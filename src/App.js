import "./App.css";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login";
import { useStateValue } from "./Components/StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/" />
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
