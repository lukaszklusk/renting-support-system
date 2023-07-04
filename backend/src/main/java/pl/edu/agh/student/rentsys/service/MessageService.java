package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.MessagePriority;
import pl.edu.agh.student.rentsys.model.MessageType;
import pl.edu.agh.student.rentsys.repository.MessageRepository;
import pl.edu.agh.student.rentsys.user.User;

import java.lang.management.OperatingSystemMXBean;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Optional<Message> getMessageById(long id){
        return messageRepository.findById(id);
    }

    public List<Message> getReceivedMessages(User user){
        return messageRepository.findAllByReceiver(user);
    }

    public List<Message> getSentMessages(User user){
        return messageRepository.findAllBySender(user);
    }

    public List<Message> getReceivedMessagesWithType(User user, MessageType type){
        return messageRepository.findAllByReceiverAndMessageType(user,type);
    }

    public List<Message> getSentMessagesWithType(User user, MessageType type){
        return messageRepository.findAllBySenderAndMessageType(user,type);
    }

    public Message markAsRead(Message message){
        message.setReadStatus("read");
        return messageRepository.save(message);
    }

    public Message markAsUnread(Message message){
        message.setReadStatus("unread");
        return messageRepository.save(message);
    }

    public Message createMessage(User sender, User receiver, String topic, LocalDateTime sendTime,
                                 MessageType messageType, String messageBody, MessagePriority priority){
        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .topic(topic)
                .sendTime(sendTime)
                .messageType(messageType)
                .messageBody(messageBody)
                .priority(priority)
                .readStatus("unread")
                .build();
        return messageRepository.save(newMessage);
    }

    public Message createMessageWithResponse(User sender, User receiver, String topic, LocalDateTime sendTime,
                                 MessageType messageType, String messageBody, MessagePriority priority,
                                 Message response){
        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .topic(topic)
                .sendTime(sendTime)
                .messageType(messageType)
                .messageBody(messageBody)
                .priority(priority)
                .readStatus("unread")
                .responseMessage(response)
                .build();
        return messageRepository.save(newMessage);
    }
}
