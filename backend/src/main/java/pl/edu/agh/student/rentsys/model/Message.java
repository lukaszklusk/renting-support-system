package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
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

    private String content;
    private LocalDateTime sendTime;
    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name="responded_id")
    private Message responseMessage;
}
