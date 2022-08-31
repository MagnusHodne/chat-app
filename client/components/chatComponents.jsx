import React, { useState } from "react";
import { Button, FAIcon } from "./basics";

export function ChatHeader({ name }) {
  return (
    <div className={"chat-header"}>
      <FAIcon icon={"fa-solid fa-hashtag"} />
      <h3>{name}</h3>
    </div>
  );
}

function ChatMessageActions({ user, handleDelete }) {
  return (
    <div className={"message-actions"}>
      <button
        className={"message-action"}
        onClick={() => alert("Not yet implemented")}
      >
        Edit
      </button>
      <button className={"message-action"} onClick={() => handleDelete()}>
        Delete
      </button>
    </div>
  );
}

function ChatMessage({ message, info, onDeleteMessage, displayInfo }) {
  const date = new Date(info.created);

  return (
    <div className={"message-container"}>
      <ChatMessageActions handleDelete={() => onDeleteMessage(info._id)} />
      {displayInfo && (
        <div className={"message-info"}>
          <strong>{info.user.name}</strong>
          <small className={"message-time"}>
            {`${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`}
          </small>
        </div>
      )}
      {message}
    </div>
  );
}

/**
 *
 * @param messages List of messages
 * @param onNewMessage Function for handling saves
 * @param onDeleteMessage Function for handling deletes
 * @param chatRoom Name of the chat room
 * @returns {JSX.Element}
 * @constructor
 */
export function ChatComponent({
  messages,
  onNewMessage,
  onDeleteMessage,
  chatRoom = "main",
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onNewMessage(message);
    setMessage("");
  }

  return (
    <div className={"chat-window"}>
      <ChatHeader name={chatRoom} />
      <div className={"scroll"}>
        {messages.map(({ message, user, created, _id }, index) => {
          let displayInfo = false;
          if (index === 0) {
            displayInfo = true;
          } else if (messages[index - 1].user.sub !== user.sub) {
            displayInfo = true;
          } else if (
            new Date(created).getTime() -
              new Date(messages[index - 1].created).getTime() >
            1000 * 3600
          ) {
            displayInfo = true;
          }

          return (
            <ChatMessage
              message={message}
              info={{ user, created, _id }}
              displayInfo={displayInfo}
              key={_id}
              onDeleteMessage={onDeleteMessage}
            />
          );
        })}
      </div>
      <footer>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus={true}
            placeholder={`Message #${chatRoom}`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button title={"Send"} />
        </form>
      </footer>
    </div>
  );
}
