package pl.edu.agh.student.rentsys.registration;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final EmailValidator emailValidator;
    public String register(RegistrationRequest request) {
        boolean isEmailValid = emailValidator.validate(request.email());
        if(!isEmailValid) {
            throw new IllegalStateException(String.format("%s in not a valid email name", request.email()));
        }
        return userService.signUp(
                new User(
                        request.username(),
                        request.email(),
                        request.password(),
                        UserRole.USER,
                        false,
                        false
                )
        );
    }
}
