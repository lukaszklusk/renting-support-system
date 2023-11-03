package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.MessageDTO;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.repository.MessageRepository;
import pl.edu.agh.student.rentsys.model.User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public Optional<MessageDTO> getDTOMessageById(Long id){
        Optional<Message> message =getMessageById(id);
        return message.map(MessageDTO::convertFromMessage);
    }

    public List<Message> getMessages(User user) {
        return messageRepository.findAllBySenderOrReceiver(user, user);
    }

    public List<MessageDTO> getMessages(String username) {
        User user = userService.getUserByUsername(username).orElse(null);
        List<Message> messages = getMessages(user);
        return messages.stream()
                .map(MessageDTO::convertFromMessage)
                .collect(Collectors.toList());
    }
    public List<MessageDTO> getReceivedMessages(String username){
        User user = userService.getUserByUsername(username).orElse(null);
        List<Message> messages = getReceivedMessages(user);
        return messages.stream()
                .map(MessageDTO::convertFromMessage)
                .collect(Collectors.toList());
    }

    public List<Message> getReceivedMessages(User user){
        return messageRepository.findAllByReceiver(user);
    }


    public List<MessageDTO> getSentMessages(String username){
        User user = userService.getUserByUsername(username).orElse(null);
        List<Message> messages = getSentMessages(user);
        return messages.stream()
                .map(MessageDTO::convertFromMessage)
                .collect(Collectors.toList());
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

    public Message createMessage(UUID clientId, User sender, User receiver, String content, LocalDateTime sendTime) {
        Message newMessage = Message.builder()
                .clientId(clientId)
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .sendTime(sendTime)
                .isRead(false)
                .build();

        return messageRepository.save(newMessage);
    }

    public Message createMessageWithResponse(UUID clientId, User sender, User receiver, String content, LocalDateTime sendTime, Message response){

        Message newMessage = Message.builder()
                .clientId(clientId)
                .responseMessage(response)
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .sendTime(sendTime)
                .isRead(false)
                .build();

        return messageRepository.save(newMessage);
    }

    public Message createMessageFromDTO(MessageDTO messageDTO) {
        UUID clientId = messageDTO.getId();
        User sender = userService.getUserByUsername(messageDTO.getSender()).orElse(null);
        User receiver = userService.getUserByUsername(messageDTO.getReceiver()).orElse(null);
        String content = messageDTO.getContent();
        LocalDateTime sendTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(messageDTO.getSendTimestamp()), ZoneId.systemDefault());
        return createMessage(clientId, sender, receiver, content, sendTime);
    }
}
