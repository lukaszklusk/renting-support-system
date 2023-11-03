package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.model.NotificationPriority;
import pl.edu.agh.student.rentsys.model.NotificationType;
import pl.edu.agh.student.rentsys.repository.MessageRepository;
import pl.edu.agh.student.rentsys.repository.NotificationRepository;
import pl.edu.agh.student.rentsys.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final MessageRepository messageRepository;
    public NotificationService(NotificationRepository notificationRepository, MessageRepository messageRepository) {
        this.notificationRepository = notificationRepository;
        this.messageRepository = messageRepository;
    }

    public Optional<Notification> getNotificationById(Long id){
        return notificationRepository.findById(id);
    }

    public List<Notification> getReceivedNotifications(User user){
        return notificationRepository.findAllByMessageReceiver(user);
    }

    public List<Notification> getSentNotifications(User user){
        return notificationRepository.findAllByMessageSender(user);
    }

    public void deleteNotification(Notification notification){

        messageRepository.delete(notification.getMessage());
        notificationRepository.delete(notification);
    }

    public Notification markNotificationAsRead(Notification notification){
        notification.getMessage().setIsRead(true);
        messageRepository.save(notification.getMessage());
        return notificationRepository.save(notification);
    }

    public Notification markNotificationAsUnread(Notification notification){
        notification.getMessage().setIsRead(false);
        messageRepository.save(notification.getMessage());
        return notificationRepository.save(notification);
    }

    public List<Notification> getReceivedNotificationsWithType(User user, NotificationType type){
        return notificationRepository.findAllByMessageReceiverAndNotificationType(user,type);
    }

    public List<Notification> getSentNotificationsWithType(User user, NotificationType type){
        return notificationRepository.findAllByMessageSenderAndNotificationType(user,type);
    }

    public Notification createNotification(User sender, User receiver, String topic, LocalDateTime sendTime,
                                           NotificationType notificationType, NotificationPriority priority){
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .sendTime(sendTime)
                .isRead(false)
                .build();

        Notification notification = Notification.builder()
                .message(message)
                .topic(topic)
                .notificationType(notificationType)
                .priority(priority)
                .build();

        return notificationRepository.save(notification);
    }

    public Notification createNotificationWithResponse(User sender, User receiver, String topic, LocalDateTime sendTime,
                                                       NotificationType notificationType, NotificationPriority priority,
                                                       Notification response) {

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .sendTime(sendTime)
                .isRead(true)
                .build();

        Notification notification = Notification.builder()
                .message(message)
                .topic(topic)
                .notificationType(notificationType)
                .priority(priority)
                .build();

        return notificationRepository.save(notification);

    }
}