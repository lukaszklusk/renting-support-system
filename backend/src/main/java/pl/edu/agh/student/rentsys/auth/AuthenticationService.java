package pl.edu.agh.student.rentsys.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
import static pl.edu.agh.student.rentsys.security.jwt.JwtConfig.*;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private final UserService userService;
    private final ConfirmationTokenService tokenService;
    private final EmailSenderService emailSenderService;
    private final JwtService jwtService;
    private final EmailValidator emailValidator;
    private final AuthenticationManager authenticationManager;

    public void signUp(SignUpRequest request) {
        boolean isEmailValid = emailValidator.validate(request.getEmail());
        if (!isEmailValid) {
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

        if (token.getConfirmedAt() != null) {
            throw new IllegalStateException("Email already confirmed");
        }

        if (timeNow.isAfter(token.getExpiresAt())) {
            throw new IllegalStateException("Token already expired");
        }

        token.setConfirmedAt(timeNow);
        User user = token.getUser();
        user.setEnabled(true);

        tokenService.save(token);
        userService.save(user);
    }

    public void signIn(SignInRequest request, HttpServletResponse response) {
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
        AuthorizationResponse authResponse = AuthorizationResponse.builder()
                .roles(roles)
                .build();

//      set access token as an HTTP-only cookie
        Cookie accessTokenCookie = new Cookie("access_token", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge((int) (JWT_ACCESS_TOKEN_VALID_TIME_IN_MS / 1000));
        response.addCookie(accessTokenCookie);

//      set refresh token as an HTTP-only cookie
        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setMaxAge((int) (JWT_REFRESH_TOKEN_VALID_TIME_IN_MS / 1000));
        response.addCookie(refreshTokenCookie);

//      add authResponse to response body
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String responseBody = objectMapper.writeValueAsString(authResponse);
            response.setContentType("application/json");
            response.getWriter().write(responseBody);
            response.setStatus(HttpServletResponse.SC_OK);
        } catch (IOException e) {
//          TODO: customize exception
            throw new IllegalStateException("Unable to add a body to a response");
        }
    }

    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        Cookie accessTokenCookie = new Cookie("access_token", "");
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(0); // Set max age to 0 to delete the cookie
        response.addCookie(accessTokenCookie);

        // Clear refresh token cookie
        Cookie refreshTokenCookie = new Cookie("refresh_token", "");
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setMaxAge(0); // Set max age to 0 to delete the cookie
        response.addCookie(refreshTokenCookie);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
//        TODO: add "refresh_token" to config
        String refreshToken = jwtService.extractTokenByName(request, "refresh_token")
                .orElseThrow(() -> new BadCredentialsException("No refresh token provided"));

//        TODO: add optional to extractUsername
        String username = jwtService.extractUsername(refreshToken);
        if (username == null) {
            throw new UsernameNotFoundException("User not found");
        }

        UserDetails user = userService.loadUserByUsername(username);
        if (!jwtService.validate(refreshToken, user)) {
//          TODO: customize exception
            throw new BadCredentialsException("Invalid refresh token");
        }

//      set access token as an HTTP-only cookie
        String accessToken = jwtService.generateAccessToken(user);
        Cookie accessTokenCookie = new Cookie("access_token", accessToken);
        accessTokenCookie.setMaxAge((int) (JWT_ACCESS_TOKEN_VALID_TIME_IN_MS / 1000));
        response.addCookie(accessTokenCookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}

