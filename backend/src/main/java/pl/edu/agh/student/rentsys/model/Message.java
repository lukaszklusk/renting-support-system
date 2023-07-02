package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDateTime;

@Entity
public class Message {
    private Long id;
    private User sender;
    private User receiver;
    private String topic;
    private LocalDateTime sendTime;
    private MessageType messageType;
    private String readStatus;
    private String messageBody;
    private MessagePriority priority;
    private long responseMessageId;

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    public Long getId() {
        return id;
    }

    @ManyToOne
    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    @ManyToOne
    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    @Enumerated(EnumType.STRING)
    public MessagePriority getPriority() {
        return priority;
    }

    public void setPriority(MessagePriority priority) {
        this.priority = priority;
    }

    public long getResponseMessageId() {
        return responseMessageId;
    }

    public void setResponseMessageId(long responseMessageId) {
        this.responseMessageId = responseMessageId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public LocalDateTime getSendTime() {
        return sendTime;
    }

    public void setSendTime(LocalDateTime sendTime) {
        this.sendTime = sendTime;
    }

    @Enumerated(EnumType.STRING)
    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getReadStatus() {
        return readStatus;
    }

    public void setReadStatus(String readStatus) {
        this.readStatus = readStatus;
    }
}
