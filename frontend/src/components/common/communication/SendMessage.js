import React, { useState } from "react";
import useData from "../../../hooks/useData";
import {
  ConversationList,
  Conversation,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
// import img from "../../../img1.png";

import AvatarComponent from "./AvatarComponent";
import Chat from "./Chat";

// lillyIco,
// joeIco,
// emilyIco,
// kaiIco,
// akaneIco,
// eliotIco,
// zoeIco,
// patrikIco,

const SendMessage = () => {
  const { sendMessage } = useData();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (receiver.trim() && message.trim()) {
      sendMessage(receiver, message);
      setReceiver("");
      setMessage("");
    }
  };

  console.log("test");

  // Funkcja generująca awatar na podstawie pierwszej litery
  const generateAvatarFromInitials = (initials) => {
    return `https://ui-avatars.com/api/?name=${initials}`;
  };

  // Wywołanie funkcji i uzyskanie wartości avatara jako string
  const avatarInitials = "John"; // Przykładowe inicjały
  const avatarURL = generateAvatarFromInitials(avatarInitials); // Generowanie URL-a awatara na podstawie inicjałów
  console.log("avatarURL:", avatarURL); // Wyświetlenie adresu URL avatara jako string

  return (
    <Chat />
    // <>
    //   <div>
    //     <h2>Send Message</h2>
    //     <input
    //       type="text"
    //       placeholder="Receiver"
    //       value={receiver}
    //       onChange={(e) => setReceiver(e.target.value)}
    //     />
    //     <textarea
    //       placeholder="Type your message"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //     />
    //     <button onClick={handleSend}>Send</button>
    //   </div>
    // </>
  );
};

export default SendMessage;
