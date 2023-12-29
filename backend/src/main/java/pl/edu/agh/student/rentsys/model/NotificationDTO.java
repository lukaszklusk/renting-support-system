package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.time.ZoneId;
import java.util.UUID;

@Builder
@Data
public class NotificationDTO {
    private UUID id;
    private String receiver;
    private String sender;
    private Long sendTimestamp;
    private String notificationType;
    private String priority;
    private String notifiableName;
    private String notifiableRelatedName;
    private Boolean isRead;


    public static NotificationDTO convertFromSenderNotification(Notification notification) {
        String receiver = null;
        if (notification.getReceiver() != null) {
            receiver = notification.getReceiver().getUsername();
        }
        return NotificationDTO.builder()
                .id(notification.getClientId())
                .receiver(receiver)
                .sender(notification.getSender().getUsername())
                .sendTimestamp(notification.getSendTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())
                .notificationType(notification.getNotificationType().toString())
                .priority(notification.getPriority().toString())
                .notifiableName(notification.getNotifiableName())
                .notifiableRelatedName(notification.getNotifiableRelatedName())
                .isRead(notification.getSenderIsRead())
                .build();
    }

    public static NotificationDTO convertFromReceiverNotification(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getClientId())
                .receiver(notification.getReceiver().getUsername())
                .sender(notification.getSender().getUsername())
                .sendTimestamp(notification.getSendTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())
                .notificationType(notification.getNotificationType().toString())
                .priority(notification.getPriority().toString())
                .notifiableName(notification.getNotifiableName())
                .notifiableRelatedName(notification.getNotifiableRelatedName())
                .isRead(notification.getReceiverIsRead())
                .build();
    }
}
