import React, { useState, useEffect } from "react";
import { ChatEngine, getOrCreateChat } from "react-chat-engine";
import useAuth from "../../../hooks/useAuth";

const Chat = () => {
  const { auth } = useAuth();
  const [username, setUsername] = useState("");

  function createDirectChat(creds) {
    getOrCreateChat(
      creds,
      { is_direct_chat: true, usernames: [username] },
      () => setUsername("")
    );
  }

  function renderChatForm(creds) {
    return (
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => createDirectChat(creds)}>Create</button>
      </div>
    );
  }

  console.log("username: ", auth.username);

  return (
    <ChatEngine
      height="100vh"
      projectID="
            1ca5942f-dc6f-434c-a124-065a2522f573"
      userName={auth.username}
      userSecret={auth.username}
      renderNewChatForm={(creds) => renderChatForm(creds)}
      onConnect={(creds) => {
        console.log("connect");
        console.log(creds);
      }}
      onNewMessage={(creds) => {
        console.log("new message");
        console.log(creds);
      }}
    />
  );
};

export default Chat;
