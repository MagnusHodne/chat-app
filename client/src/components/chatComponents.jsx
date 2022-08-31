import React, { useContext, useState } from "react";
import { Button, FAIcon } from "./basics";
import { UserContext } from "../userContext";

export function ChatHeader({ name }) {
  return (
    <div className={"flex flex-row items-center gap-2 pl-2"}>
      <FAIcon icon={"fa-solid fa-hashtag"} />
      <h3 className={"font-black"}>{name}</h3>
    </div>
  );
}

function ChatMessageAction({ icon, onClick, className }) {
  return (
    <button
      className={`border-none px-2 py-1 hover:bg-thischord-500 ${className}`}
      onClick={() => onClick()}
    >
      <FAIcon icon={icon} />
    </button>
  );
}

function ChatMessageActions({ author, handleDelete }) {
  const { user } = useContext(UserContext);
  const userIsAuthor = author.sub === user.sub;
  return (
    <div
      className={
        "absolute right-2 top-0 -translate-y-1/2 flex-row items-center justify-center self-end overflow-clip rounded border border-solid border-thischord-800 bg-thischord-600"
      }
    >
      <ChatMessageAction
        icon={"fa-solid fa-heart"}
        onClick={() => alert("Not yet implemented")}
      />

      {userIsAuthor && (
        <>
          <ChatMessageAction
            icon={"fa-solid fa-pencil"}
            onClick={() => alert("Not yet implemented")}
          />
          <ChatMessageAction
            icon={"fa-solid fa-trash-can"}
            onClick={() => handleDelete()}
            className={"text-red-600 hover:bg-red-600 hover:text-white"}
          />
        </>
      )}
    </div>
  );
}

function ChatMessage({ message, info, onDeleteMessage, displayInfo }) {
  const created = new Date(info.created);
  let date;
  if (Date.now() - created.getTime() < 1000 * 3600 * 24) {
    date = "Today";
  } else if (Date.now() - created.getTime() < 1000 * 3600 * 48) {
    date = "Yesterday";
  } else {
    date = created.toDateString();
  }
  const hours =
    created.getHours() < 10 ? `0${created.getHours()}` : created.getHours();
  const minutes =
    created.getMinutes() < 10
      ? `0${created.getMinutes()}`
      : created.getMinutes();
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={"relative flex flex-col hover:bg-thischord-700"}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions && (
        <ChatMessageActions
          author={info.user}
          handleDelete={() => onDeleteMessage(info._id)}
        />
      )}
      {displayInfo && (
        <div className={"mt-2 flex gap-2 pb-0"}>
          <div className={"inline-block"}>
            <span className={"font-extrabold"}>{info.user.name}</span>
          </div>

          <div className={"inline-block"}>
            <span className={"text-xs font-light text-[#99aab5]"}>
              {`${date} ${hours}:${minutes}`}
            </span>
          </div>
        </div>
      )}
      <div className={"py-0.5 px-0"}>{message}</div>
    </div>
  );
}

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
    <div className={"grid h-full grid-rows-[3em_1fr_auto]"}>
      <ChatHeader name={chatRoom} />
      <div className={"scrollbar overflow-y-auto overflow-x-hidden pt-3"}>
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
        <form
          className={"m-0 flex h-full flex-row items-stretch gap-1"}
          onSubmit={handleSubmit}
        >
          <input
            className={
              "flex-1 rounded border-none bg-thischord-500 px-3 py-0 placeholder:text-thischord-300"
            }
            autoFocus={true}
            placeholder={`Message #${chatRoom}`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button title={"Send"} className={"m-0 h-full"} />
        </form>
      </footer>
    </div>
  );
}
