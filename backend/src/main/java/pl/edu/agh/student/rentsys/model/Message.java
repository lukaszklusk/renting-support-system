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
public class Message {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name="sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name="receiver_id")
    private User receiver;
    private LocalDateTime sendTime;
    private Boolean isRead;
    private String content;

    @ManyToOne
    @JoinColumn(name="response_message_id")
    private Message responseMessage;
}
