import React, { useState, useEffect } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Search,
  Sidebar,
  Avatar,
  Conversation,
  ConversationHeader,
  ConversationList,
  InfoButton,
  VoiceCallButton,
  ChatContainer,
  VideoCallButton,
  MessageList,
  MessageSeparator,
  Message,
  ExpansionPanel,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import useData from "../../../hooks/useData";
import img from "../../../img.png";

import useAuth from "../../../hooks/useAuth";

const Chat = () => {
  const [messageInputValue, setMessageInputValue] = useState("");

  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [sortedConversations, setSortedConversations] = useState([]);
  const [sortedActiveMessages, setSortedActiveMessages] = useState([]);

  const { messages, sendMessage } = useData();
  const { auth } = useAuth();

  const MyConversation = {
    create: function (name, messages, lastMessage) {
      return {
        name: name,
        messages: messages || [],
        lastMessage: lastMessage || {},
      };
    },
  };

  const createConversations = (messages) => {
    console.log("createConversations:", messages);
    const username = auth?.username;
    const conversations = {};
    if (!username) {
      return conversations;
    }

    messages?.forEach((element) => {
      const conversatorUsername =
        element.sender === username ? element.receiver : element.sender;
      if (!conversations[conversatorUsername]) {
        conversations[conversatorUsername] = MyConversation.create(
          conversatorUsername,
          [element],
          element
        );
      } else {
        const conversation = conversations[conversatorUsername];
        conversation.messages.push(element);
        if (element.sendTimestamp > conversation.lastMessage.sendTimestamp) {
          conversation.lastMessage = element;
        }
      }
    });
    return conversations;
  };

  const onSend = () => {
    let content = messageInputValue;
    if (content.trim()) {
      sendMessage(activeConversation.name, content);
      setMessageInputValue("");
    }
  };

  useEffect(() => {
    setConversations(createConversations(messages));
  }, [messages]);

  useEffect(() => {
    activeConversation &&
      setActiveConversation(conversations[activeConversation.name]);
  }, [conversations]);

  useEffect(() => {
    setSortedConversations(
      Object.values(conversations).sort((convA, convB) => {
        return (
          convB.lastMessage.sendTimestamp - convA.lastMessage.sendTimestamp
        );
      })
    );
  }, [conversations]);

  useEffect(() => {
    setSortedActiveMessages(
      activeConversation?.messages.sort((msgA, msgB) => {
        return msgA.sendTimeStamp - msgB.sendTimeStamp;
      })
    );
  }, [activeConversation, messages]);

  return (
    <div
      style={{
        height: "600px",
        position: "relative",
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            {sortedConversations.map((conversation, idx) => (
              // <span key={idx}>
              <Conversation
                key={idx}
                name={conversation.name}
                lastSenderName={conversation.lastMessage.sender}
                info={conversation.lastMessage.content}
                onClick={(_) => setActiveConversation(conversation)}
              >
                <Avatar src={img} name={conversation.name} />
              </Conversation>
              // </span>
            ))}
          </ConversationList>
        </Sidebar>

        {activeConversation && sortedActiveMessages ? (
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <Avatar src={img} name={activeConversation.name} />
              <ConversationHeader.Content userName={activeConversation.name} />
            </ConversationHeader>
            <MessageList>
              {sortedActiveMessages.map((msg, idx) => (
                <>
                  {msg.sender === auth?.username ? (
                    <Message
                      model={{
                        message: msg.content,
                        sentTime: "15 mins ago",
                        sender: msg.content,
                        direction: "outgoing",
                        position: "single",
                      }}
                      // avatarSpacer
                    >
                      {" "}
                      <Avatar src={img} name={msg.sender} />
                    </Message>
                  ) : (
                    <Message
                      model={{
                        message: msg.content,
                        sentTime: "15 mins ago",
                        sender: msg.content,
                        direction: "incoming",
                        position: "single",
                      }}
                    >
                      <Avatar src={img} name={msg.sender} />
                    </Message>
                  )}
                </>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              value={messageInputValue}
              onChange={(val) => setMessageInputValue(val)}
              onSend={onSend}
            />
          </ChatContainer>
        ) : null}
      </MainContainer>
    </div>
  );
};

export default Chat;
