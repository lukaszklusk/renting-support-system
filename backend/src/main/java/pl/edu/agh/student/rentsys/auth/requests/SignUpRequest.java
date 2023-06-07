package pl.edu.agh.student.rentsys.auth.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pl.edu.agh.student.rentsys.auth.validators.ValidRole;

@Data
@Builder
@AllArgsConstructor
public class SignUpRequest {
    private String username;
    private String email;
    @ValidRole
    private String role;
    private String password;
}
