package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.repository.MessageRepository;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
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
}
