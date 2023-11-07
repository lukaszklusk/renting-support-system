package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private UUID clientId;

    @ManyToOne
    @JoinColumn(name="sender_id")
    protected User sender;

    @ManyToOne
    @JoinColumn(name="receiver_id")
    private User receiver;

    private LocalDateTime sendTime;
    private Boolean senderIsRead;
    private Boolean receiverIsRead;

    private NotificationType notificationType;
    private NotificationPriority priority;
    private String notifiableName;

    @ManyToOne
    @JoinColumn(name="responded_id")
    private Notification responseNotification;
}
