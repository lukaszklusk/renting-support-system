package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

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

    private NotificationType notificationType;
    private NotificationPriority priority;
    private String topic;

    @OneToOne
    private Message message;

    @ManyToOne
    @JoinColumn(name="responded_id")
    private Notification responseNotification;
}
