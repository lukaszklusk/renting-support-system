package pl.edu.agh.student.rentsys.auth;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.auth.email.EmailSenderService;
import pl.edu.agh.student.rentsys.auth.email.EmailValidator;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationToken;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationTokenService;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.security.jwt.JwtService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.LocalDateTime;

import static pl.edu.agh.student.rentsys.auth.AuthenticationConfig.*;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final ConfirmationTokenService tokenService;
    private final EmailSenderService emailSenderService;
    private final JwtService jwtService;
    private final EmailValidator emailValidator;
    private final AuthenticationManager authenticationManager;

    public void register(SignUpRequest request) {
        boolean isEmailValid = emailValidator.validate(request.getEmail());
        if(!isEmailValid) {
            throw new IllegalStateException(String.format("%s in not a valid email", request.getEmail()));
        }
        String token = userService.signUp(
                User.builder()
                        .username(request.getUsername())
                        .email(request.getEmail())
                        .password(request.getPassword())
                        .userRole(UserRole.USER)
                        .enabled(false)
                        .locked(false)
                        .build()
        );
        emailSenderService.send(
                APP_EMAIL,
                request.getEmail(),
                CONFIRMATION_EMAIL_SUBJECT,
                buildEmailBody(request.getUsername(), buildActivationLink(token))
        );
    }

    public void activateUser(String sToken) {
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
    }

    public SignInResponse login(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        UserDetails user = userService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtService.generateToken(user);
        return SignInResponse.builder()
                .token(jwtToken)
                .build();

    }
}
