package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.model.NotificationPriority;
import pl.edu.agh.student.rentsys.model.NotificationType;
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

    public Optional<Message> getMessageById(long id){
        return messageRepository.findById(id);
    }

    public List<Message> getReceivedMessages(User user){
        return messageRepository.findAllByReceiver(user);
    }

    public List<Message> getSentMessages(User user){
        return messageRepository.findAllBySender(user);
    }

    public void deleteMessage(Message notification){
        messageRepository.delete(notification);
    }

    public List<Message> getReceivedMessagesWithType(User user, NotificationType type){
        return messageRepository.findAllByReceiverAndMessageType(user,type);
    }

    public List<Message> getSentMessagesWithType(User user, NotificationType type){
        return messageRepository.findAllBySenderAndMessageType(user,type);
    }

    public Message markAsRead(Notification notification){
        notification.setIsRead(true);
        return messageRepository.save(notification);
    }

    public Message markAsUnread(Notification notification){
        notification.setIsRead(false);
        return messageRepository.save(notification);
    }

    public Message createMessage(User sender, User receiver, String topic, LocalDateTime sendTime,
                                      NotificationType notificationType, String messageBody, NotificationPriority priority){
        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .topic(topic)
                .sendTime(sendTime)
                .messageType(notificationType)
                .messageBody(messageBody)
                .priority(priority)
                .readStatus("unread")
                .build();
        return messageRepository.save(newMessage);
    }

    public Message createMessageWithResponse(User sender, User receiver, String topic, LocalDateTime sendTime,
                                                  NotificationType notificationType, String messageBody, NotificationPriority priority,
                                                  Notification response){
        Message newNotification = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .topic(topic)
                .sendTime(sendTime)
                .messageType(notificationType)
                .messageBody(messageBody)
                .priority(priority)
                .readStatus("unread")
                .responseNotification(response)
                .build();
        return messageRepository.save(newNotification);
    }
}
