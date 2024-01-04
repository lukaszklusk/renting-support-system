package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.time.ZoneId;
import java.util.UUID;

@Data
@Builder
public class MessageDTO {
    private UUID id;
    private String receiver;
    private String content;
    private String sender;
    private Long sendTimestamp;

    public static MessageDTO convertFromMessage(Message message) {
        return MessageDTO.builder()
                .id(message.getClientId())
                .receiver(message.getReceiver().getUsername())
                .sender(message.getSender().getUsername())
                .content(message.getContent())
                .sendTimestamp(message.getSendTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())
                .build();
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "id=" + id +
                ", receiver='" + receiver + '\'' +
                ", content='" + content + '\'' +
                ", sender='" + sender + '\'' +
                ", sendTimestamp=" + sendTimestamp +
                '}';
    }
}
