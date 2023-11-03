package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.time.ZoneOffset;
import java.util.UUID;

@Data
@Builder
public class MessageDTO {
    private UUID id;
    private String receiver;
    private String content;
    protected String sender;
    private Long sendTimestamp;

    public static MessageDTO convertFromMessage(Message message) {
        return MessageDTO.builder()
                .id(message.getClientId())
                .receiver(message.getReceiver().getUsername())
                .sender(message.getSender().getUsername())
                .content(message.getContent())
                .sendTimestamp(message.getSendTime().toEpochSecond(ZoneOffset.ofHours(0)))
                .build();
    }
}
