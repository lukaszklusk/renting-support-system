package pl.edu.agh.student.rentsys.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.auth.email.EmailSenderService;
import pl.edu.agh.student.rentsys.auth.email.EmailValidator;
import pl.edu.agh.student.rentsys.auth.requests.SignInRequest;
import pl.edu.agh.student.rentsys.auth.requests.SignUpRequest;
import pl.edu.agh.student.rentsys.auth.responses.AuthorizationResponse;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationToken;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationTokenService;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.security.jwt.JwtService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.io.IOException;
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

        UserRole userRole = request.getRole().equals("client") ? UserRole.CLIENT : UserRole.OWNER;
        String token = userService.signUp(
                User.builder()
                        .username(request.getUsername())
                        .email(request.getEmail())
                        .password(request.getPassword())
                        .userRole(userRole)
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

    public AuthorizationResponse login(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        UserDetails user = userService.loadUserByUsername(request.getUsername());
        String[] roles = userService.getUserRolesAsStringArray(user);
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return AuthorizationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(roles)
                .build();

    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        String refreshToken = jwtService.extractToken(request);
        String username = jwtService.extractUsername(refreshToken);
        if(username != null) {
            UserDetails user = userService.loadUserByUsername(username);
            if(jwtService.validate(refreshToken, user)) {
                String accessToken = jwtService.generateAccessToken(user);
                String[] roles = userService.getUserRolesAsStringArray(user);
                AuthorizationResponse authorizationResponse = AuthorizationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .roles(roles)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authorizationResponse);
            }
        }
    }
}
