import React, { useEffect, useState } from "react";
import "./../CSS/SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./../firebase";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function SidebarChat({ id, name, photoURL, addNewChat }) {
  const [SEED, setSEED] = useState("");
  const [messages, setMessages] = useState("");
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
    setSEED(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  const createChat = () => {
    const email = prompt("Please enter email for chat");
    if (email) {
      db.collection("users")
        .doc(email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            db.collection("rooms").add({
              firstUser: email,
              secondUser: user.email,
              firstUserName: doc.data().name,
              secondUserName: user.displayName,
              firstUserDP: doc.data().photoURL,
              secondUserDP: user?.photoURL,
            });
          } else {
            alert(`No user found with ${email}`);
          }
        });
    } else {
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={
            photoURL
              ? photoURL
              : `https://avatars.dicebear.com/api/human/${SEED}.svg`
          }
        />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
