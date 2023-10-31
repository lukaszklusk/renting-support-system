package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DTOMessage {
    private String receiver;
    private String content;
    protected String sender;
    private Long sendTimestamp;
}
