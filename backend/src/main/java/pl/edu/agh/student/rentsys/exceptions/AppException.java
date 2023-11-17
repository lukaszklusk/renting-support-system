package pl.edu.agh.student.rentsys.exceptions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
public class AppException {
    private String message;
    private HttpStatus httpStatus;
    private ZonedDateTime timestamp;
}
