package pl.edu.agh.student.rentsys.registration;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.registration.email.EmailSenderService;
import pl.edu.agh.student.rentsys.registration.email.EmailValidator;
import pl.edu.agh.student.rentsys.registration.token.ConfirmationToken;
import pl.edu.agh.student.rentsys.registration.token.ConfirmationTokenService;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.LocalDateTime;

import static pl.edu.agh.student.rentsys.registration.RegistrationConfig.*;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final ConfirmationTokenService tokenService;
    private final EmailValidator emailValidator;
    private final EmailSenderService emailSenderService;

    public String register(RegistrationRequest request) {
        boolean isEmailValid = emailValidator.validate(request.email());
        if(!isEmailValid) {
            throw new IllegalStateException(String.format("%s in not a valid email", request.email()));
        }
        String token = userService.signUp(
                User.builder()
                        .username(request.username())
                        .email(request.email())
                        .password(request.password())
                        .userRole(UserRole.USER)
                        .enabled(false)
                        .locked(false)
                        .build()
        );
        emailSenderService.send(
                APP_EMAIL,
                request.email(),
                CONFIRMATION_EMAIL_SUBJECT,
                buildEmailBody(request.username(), buildActivationLink(token))
        );
        return token;
    }

    public String confirmToken(String sToken) {
        LocalDateTime timeNow = LocalDateTime.now();

        ConfirmationToken token = tokenService.getToken(sToken)
                .orElseThrow(() -> new IllegalStateException(String.format("Token %s not found", sToken)));

        if(token.getConfirmedAt() != null) {
            throw new IllegalStateException("Email already confirmed");
        }

        if(timeNow.isAfter(token.getExpiresAt())) {
            throw new IllegalStateException("Token already expired");
        }

        token.setConfirmedAt(timeNow);
        User user = token.getUser();
        user.setEnabled(true);

        tokenService.save(token);
        userService.save(user);

        return "enabled";
    }
}
