package pl.edu.agh.student.rentsys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.DTOMessage;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.repository.MessageRepository;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserRepository;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    public MessageService(MessageRepository messageRepository, UserService userService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
    }

    public Optional<Message> getMessageById(Long id){
        return messageRepository.findById(id);
    }

    public List<Message> getReceivedMessages(User user){
        return messageRepository.findAllByReceiver(user);
    }

    public List<Message> getSentMessages(User user){
        return messageRepository.findAllBySender(user);
    }

    public void deleteMessage(Message message){
        messageRepository.delete(message);
    }

    public Message markMessageAsRead(Message message){
        message.setIsRead(true);
        return messageRepository.save(message);
    }

    public Message markMessageAsUnread(Message message){
        message.setIsRead(false);
        return messageRepository.save(message);
    }

    public Message createMessage(User sender, User receiver, String content, LocalDateTime sendTime) {
        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .sendTime(sendTime)
                .isRead(false)
                .build();

        return messageRepository.save(newMessage);
    }

    public Message createMessageWithResponse(User sender, User receiver, String content, LocalDateTime sendTime, Message response){

        Message newMessage = Message.builder()
                .responseMessage(response)
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .sendTime(sendTime)
                .isRead(false)
                .build();

        return messageRepository.save(newMessage);
    }

    public Message createMessageFromDTO(DTOMessage dtoMessage) {

        User sender = userService.getUserByUsername(dtoMessage.getSender()).orElse(null);
        User receiver = userService.getUserByUsername(dtoMessage.getReceiver()).orElse(null);
        String content = dtoMessage.getContent();
        LocalDateTime sendTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(dtoMessage.getSendTimestamp()), ZoneId.systemDefault());
        return createMessage(sender, receiver, content, sendTime);
    }
}
