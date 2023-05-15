import React, { useState, useEffect } from "react";
import "./../CSS/Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import SidebarChat from "./SidebarChat";
import db from "./../firebase";
import { useStateValue } from "./StateProvider";

function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />

      </div>


      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => {
          console.log(room.data.firstUser, room.data.secondUser);
          if (room.data.firstUser === user.email) {
            return (
              <SidebarChat
                key={room.id}
                id={room.id}
                name={room.data.secondUserName}
                photoURL={room.data.secondUserDP}
              />
            );
          } else if (room.data.secondUser === user.email) {
            return (
              <SidebarChat
                key={room.id}
                id={room.id}
                name={room.data.firstUserName}
                photoURL={room.data.firstUserDP}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
