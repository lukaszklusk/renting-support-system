package pl.edu.agh.student.rentsys.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.NotificationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class NotificationService {
    @Autowired
    private final UserService userService;
    @Autowired
    private final NotificationRepository notificationRepository;
    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    public Optional<Notification> getNotificationById(Long id){
        return notificationRepository.findById(id);
    }

    public Optional<Notification> getNotificationByClientId(UUID id){
        return notificationRepository.findByClientId(id);
    }

    public List<Notification> getReceivedNotifications(User user){
        return notificationRepository.findAllByReceiver(user);
    }

    public List<NotificationDTO> getNotifications(String username) {
        User user = userService.getUserByUsername(username).orElse(null);
        List<Notification> notifications = getMessages(user);

        List<NotificationDTO> receivedNotifications = notifications.stream()
                .filter(n -> n.getReceiver() != null && Objects.equals(n.getReceiver().getUsername(), username))
                .map(NotificationDTO::convertFromReceiverNotification).toList();

        List<NotificationDTO> sendNotifications = notifications.stream()
                .filter(n -> Objects.equals(n.getSender().getUsername(), username))
                .map(NotificationDTO::convertFromSenderNotification).toList();


        return Stream.concat(receivedNotifications.stream(), sendNotifications.stream())
                .collect(Collectors.toList());
    }

    public List<Notification> getSentNotifications(User user){
        return notificationRepository.findAllBySender(user);
    }

    public List<Notification> getMessages(User user) {
        return notificationRepository.findAllBySenderOrReceiver(user, user);
    }


    public void deleteNotification(Notification notification){

        notificationRepository.delete(notification);
    }

    public NotificationDTO changeNotificationReadStatus(String username, UUID clientId, Boolean status) {
        User user = userService.getUserByUsername(username).orElseThrow(EntityNotFoundException::new);
        Notification notification = getNotificationByClientId(clientId).orElseThrow(EntityNotFoundException::new);
        if (user == notification.getSender()) {
            notification.setSenderIsRead(status);
            return NotificationDTO.convertFromSenderNotification(notificationRepository.save(notification));
        } else if (user == notification.getReceiver()) {
            notification.setReceiverIsRead(status);
            return NotificationDTO.convertFromReceiverNotification(notificationRepository.save(notification));
        } else {
            throw new IllegalStateException();
        }
    }

    public Notification markNotificationAsRead(Notification notification){
        notification.setSenderIsRead(true);
        return notificationRepository.save(notification);
    }

    public Notification markNotificationAsUnread(Notification notification){
        notification.setSenderIsRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getReceivedNotificationsWithType(User user, NotificationType type){
        return notificationRepository.findAllByReceiverAndNotificationType(user,type);
    }

    public List<Notification> getSentNotificationsWithType(User user, NotificationType type){
        return notificationRepository.findAllBySenderAndNotificationType(user,type);
    }

    public Notification createNotification(User sender, User receiver, NotificationType notificationType,
                                           NotificationPriority priority, String notifiableName){
        return notificationRepository.save(Notification.builder()
                .clientId(UUID.randomUUID())
                .sender(sender)
                .receiver(receiver)
                .sendTime(LocalDateTime.now())
                .senderIsRead(false)
                .receiverIsRead(false)
                .notificationType(notificationType)
                .priority(priority)
                .notifiableName(notifiableName)
                .build());
    }
    public void sendNotificationToUsers(Notification notification) {
        if (notification.getSender() != null) {
            NotificationDTO notificationDTO = NotificationDTO.convertFromSenderNotification(notification);
            simpMessagingTemplate.convertAndSendToUser(notificationDTO.getSender(),"/notifications" , notificationDTO);
        }
        if (notification.getReceiver() != null) {
            NotificationDTO notificationDTO = NotificationDTO.convertFromReceiverNotification(notification);
            simpMessagingTemplate.convertAndSendToUser(notificationDTO.getReceiver(),"/notifications" , notificationDTO);
        }
    }

    public Notification createAndSendNotification (User sender, User receiver, NotificationType notificationType, NotificationPriority priority, String name) {
        Notification notification = createNotification(sender, receiver, notificationType, priority, name);
        sendNotificationToUsers(notification);
        return notification;
    }
}