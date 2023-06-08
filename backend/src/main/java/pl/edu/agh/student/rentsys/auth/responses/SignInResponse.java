package pl.edu.agh.student.rentsys.auth.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SignInResponse {
    private String accessToken;
}
