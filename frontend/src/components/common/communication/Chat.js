import React, { useState, useEffect, useRef } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Search,
  Sidebar,
  Avatar,
  Conversation,
  ConversationHeader,
  ConversationList,
  ChatContainer,
  MessageList,
  MessageSeparator,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import useData from "../../../hooks/useData";
import { useUser } from "../../../hooks/useCommunication";
import img from "../../../img.png";
import { debounce } from "lodash";

const Chat = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const searchValRef = useRef();

  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [sortedConversations, setSortedConversations] = useState([]);
  const [sortedActiveMessages, setSortedActiveMessages] = useState([]);

  const { username, messages, sendMessage } = useData();
  const fetchUserByUsername = useUser();

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

  const filterConversations = (conversations, searchVal) => {
    return Object.fromEntries(
      Object.entries(conversations).filter(([key]) => key.startsWith(searchVal))
    );
  };

  const debouncedNewConversationSearch = useRef(
    debounce(async (username) => {
      try {
        const user = await fetchUserByUsername(username);
        if (!conversations[username]) {
          const newConversation = MyConversation.create(username, [], null);
          const updatedConversations = { ...conversations };
          updatedConversations[username] = newConversation;
          setConversations(updatedConversations);
        }
      } catch (err) {
        console.log("debounce err:", err);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    return () => {
      debouncedNewConversationSearch.cancel();
    };
  }, [debouncedNewConversationSearch]);

  useEffect(() => {
    updateConversations(messages, conversations, searchVal, true);
  }, [messages]);

  useEffect(() => {
    let toCreate = true;
    if (searchValRef.current?.length < searchVal?.length) {
      toCreate = false;
    }
    updateConversations(messages, conversations, searchVal, toCreate);
    searchValRef.current = searchVal;
  }, [searchVal]);

  useEffect(() => {
    activeConversation &&
      conversations[activeConversation.name] &&
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

  const updateConversations = async (
    messages,
    conversations,
    searchVal,
    toCreate
  ) => {
    if (
      searchVal &&
      messages?.filter((msg) => {
        return msg.receiver === searchVal || msg.sender === searchVal;
      }).length == 0
    ) {
      debouncedNewConversationSearch(searchVal);
    }
    const updatedConversations = toCreate
      ? createConversations(messages)
      : conversations;
    const filteredConversations = filterConversations(
      updatedConversations,
      searchVal
    );
    setConversations(filteredConversations);
  };

  const onActivateConversation = (conversation) => {
    setSearchVal("");
    setActiveConversation(conversation);
  };

  return (
    <div
      style={{
        height: "600px",
        position: "relative",
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search
            placeholder="Search..."
            value={searchVal}
            onChange={setSearchVal}
            onClearClick={() => setSearchVal("")}
          />
          <ConversationList>
            {sortedConversations.map((conversation, idx) => (
              <Conversation
                key={idx}
                name={conversation.name}
                lastSenderName={conversation?.lastMessage.sender}
                info={conversation?.lastMessage.content}
                onClick={(_) => onActivateConversation(conversation)}
              >
                <Avatar src={img} name={conversation.name} />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        {activeConversation && (
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <Avatar src={img} name={activeConversation.name} />
              <ConversationHeader.Content userName={activeConversation.name} />
            </ConversationHeader>

            {sortedActiveMessages?.length > 0 && (
              <MessageList>
                {sortedActiveMessages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    <Message
                      model={{
                        message: msg.content,
                        sentTime: "15 mins ago",
                        sender: msg.content,
                        direction:
                          msg.sender === username ? "outgoing" : "incoming",
                        position: "single",
                      }}
                    >
                      {msg.sender === username && (
                        <Avatar src={img} name={msg.sender} />
                      )}
                    </Message>
                  </React.Fragment>
                ))}
              </MessageList>
            )}
            <MessageInput
              placeholder="Type message here"
              value={messageInputValue}
              onChange={(val) => setMessageInputValue(val)}
              onSend={onSend}
            />
          </ChatContainer>
        )}
      </MainContainer>
    </div>
  );
};

export default Chat;
