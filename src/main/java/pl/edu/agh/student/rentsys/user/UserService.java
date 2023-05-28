package pl.edu.agh.student.rentsys.user;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.student.rentsys.registration.token.ConfirmationToken;
import pl.edu.agh.student.rentsys.registration.token.ConfirmationTokenService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final ConfirmationTokenService confirmationTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String USER_NOT_FOUND = "Username %s not found";
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND, username)));
    }

    public void save(User user) {
        userRepository.save(user);
    }

    @Transactional
    public String signUp(User user) {
        boolean isEmailTaken = userRepository
                .findByEmail(user.getEmail())
                .isPresent();
        if(isEmailTaken) {
            throw new IllegalStateException(String.format("Email %s already taken", user.getEmail()));
        }

        boolean isUsernameTaken = userRepository
                .findByUsername(user.getUsername())
                .isPresent();
        if(isUsernameTaken) {
            throw new IllegalStateException(String.format("Username %s already taken", user.getUsername()));
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        save(user);

        final int TOKEN_VALID_MINUTES = 15;
        ConfirmationToken token = ConfirmationToken.builder()
                .token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(TOKEN_VALID_MINUTES))
                .user(user)
                .build();
        confirmationTokenService.save(token);

        return token.getToken();
    }
}
