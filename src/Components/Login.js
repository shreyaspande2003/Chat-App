import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "../firebase";
import "./../CSS/Login.css";
import { useStateValue } from "./StateProvider";
import db from "./../firebase";
import { actionType } from "./Reducer";

function Login() {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionType.SET_USER,
          user: result.user,
        });
        console.log(result.user.email);
        var docRef = db.collection("users").doc(result.user.email);

        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
            } else {
              db.collection("users").doc(result.user.email).set({
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user?.photoURL,
              });
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      })
      .catch((error) => alert(error.message));
  };



  return (
    <div className="login">
      <div className="login__container">

        <div className="login__text">
          <h1>Sign in to Chat App</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
