package pl.edu.agh.student.rentsys.auth.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pl.edu.agh.student.rentsys.auth.validators.ValidRole;

@Data
@Builder
@AllArgsConstructor
public class SignUpRequest {
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    @ValidRole
    private String role;
    private String password;
}
