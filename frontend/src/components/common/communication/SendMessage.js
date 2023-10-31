import React, { useState } from "react";
import useCommunication from "../../../hooks/useCommunication";

const SendMessage = () => {
  const { sendMessage } = useCommunication();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (receiver.trim() && message.trim()) {
      sendMessage(receiver, message);
      setReceiver("");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Send Message</h2>
      <input
        type="text"
        placeholder="Receiver"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <textarea
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default SendMessage;
