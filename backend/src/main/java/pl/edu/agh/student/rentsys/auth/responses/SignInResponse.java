package pl.edu.agh.student.rentsys.auth.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SignInResponse {
    private String accessToken;
    private String[] roles;
}
