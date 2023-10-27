package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name="receiver_id")
    private User receiver;

    private NotificationType notificationType;
    private NotificationPriority priority;
    private LocalDateTime sendTime;
    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name="response_notification_id")
    private Notification responseNotification;

    @ManyToOne
    @JoinColumn(name="related_object_id")
    private NotificationRelatedBaseEntity relatedObject;

}
