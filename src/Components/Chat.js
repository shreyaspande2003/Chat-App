import { Avatar, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { SearchOutlined } from "@material-ui/icons";
import React, { useState, useEffect, useRef } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MicIcon from "@material-ui/icons/Mic";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import "./../CSS/Chat.css";
import db from "./../firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import Picker from "emoji-picker-react";
import CloseIcon from "@material-ui/icons/Close";

function Chat() {
  const [input, setInput] = useState("");
  const [SEED, setSEED] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState({ name: "", photoURL: "" });
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [isPreviewShown, setPreviewShown] = useState(false);
  const [isCloseShown, setCloseShown] = useState(false);

  const myRef = React.createRef();
  const messagesEndRef = React.createRef();
  const openEmoji = () => {
    setPreviewShown(!isPreviewShown);
    setCloseShown(!isCloseShown);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (event, emojiObject) => {
    const position = myRef.current.selectionStart;
    var output = [
      input.slice(0, position),
      emojiObject.emoji,
      input.slice(position),
    ].join("");
    setInput(output);
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) =>
          setRoomName(
            user.displayName === snapshot.data().firstUserName
              ? {
                  name: snapshot.data().secondUserName,
                  photoURL: snapshot.data().secondUserDP,
                }
              : {
                  name: snapshot.data().firstUserName,
                  photoURL: snapshot.data().firstUserDP,
                }
          )
        );
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSEED(Math.floor(Math.random() * 5000));
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>>>", input);
    setInput("");
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={
            roomName.photoURL
              ? roomName.photoURL
              : `https://avatars.dicebear.com/api/human/${SEED}.svg`
          }
        />
        <div className="chat__headerinfo">
          <h3>{roomName.name}</h3>
          <p>
            Last Messaage:{" "}
            {messages.length
              ? new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toLocaleString("hi-IN")
              : "none"}
          </p>
        </div>

      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat_reciever"
            } `}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleString("hi-IN")}
            </span>
          </p>
        ))}
        {isPreviewShown && (
          <Picker
            pickerStyle={{ position: "absolute", bottom: 0, left: 0 }}
            onEmojiClick={onEmojiClick}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat__footer">
        {!isCloseShown && (
          <IconButton onClick={openEmoji}>
            <InsertEmoticonIcon />
          </IconButton>
        )}

        {isCloseShown && (
          <IconButton onClick={openEmoji}>
            <CloseIcon />
          </IconButton>
        )}

        <form>
          <input
            value={input}
            ref={myRef}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          ></input>
          <button onClick={sendMessage} type="submit">
            Send a messaage
          </button>
        </form>

      </div>
    </div>
  );
}

export default Chat;
