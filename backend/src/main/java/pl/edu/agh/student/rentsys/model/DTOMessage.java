package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;
import java.time.ZoneOffset;
import java.util.UUID;

@Data
@Builder
public class DTOMessage {
    private UUID id;
    private String receiver;
    private String content;
    protected String sender;
    private Long sendTimestamp;

    public static DTOMessage convertFromMessage(Message message) {
        return DTOMessage.builder()
                .id(message.getClientId())
                .receiver(message.getReceiver().getUsername())
                .sender(message.getSender().getUsername())
                .content(message.getContent())
                .sendTimestamp(message.getSendTime().toEpochSecond(ZoneOffset.ofHours(0)))
                .build();
    }
}
