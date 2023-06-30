package pl.edu.agh.student.rentsys.user;

import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationToken;
import pl.edu.agh.student.rentsys.auth.token.ConfirmationTokenService;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static pl.edu.agh.student.rentsys.auth.AuthenticationConfig.ACTIVATION_TOKEN_VALID_TIME_IN_MINUTES;

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

        User registeredNotActivatedUser = null;

        Optional<User> optionalRegisteredUser = userRepository
                .findByEmail(user.getEmail());
        if(optionalRegisteredUser.isPresent()) {
            if(optionalRegisteredUser.get().isEnabled()) {
                throw new IllegalStateException(String.format("Email %s already taken", user.getEmail()));
            }
            registeredNotActivatedUser = optionalRegisteredUser.get();
            List<ConfirmationToken> userTokens = confirmationTokenService.getUserTokens(registeredNotActivatedUser);
            for (var token: userTokens) {
                token.setExpiresAt(token.getCreatedAt());
            }
            confirmationTokenService.saveAll(userTokens);
        }

        userRepository
                .findByUsername(user.getUsername())
                .ifPresent(db_user -> {
                    if(!db_user.getEmail().equals(user.getEmail())) {
                        throw new IllegalStateException(String.format("Username %s already taken", user.getUsername()));
                    }
                });

        String encodedPassword = passwordEncoder.encode(user.getPassword());

        User dbUser = user;
        if(registeredNotActivatedUser != null) {
            registeredNotActivatedUser.setUsername(user.getUsername());
            dbUser = registeredNotActivatedUser;
        }

        dbUser.setPassword(encodedPassword);
        save(dbUser);

        ConfirmationToken token = ConfirmationToken.builder()
                .token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(ACTIVATION_TOKEN_VALID_TIME_IN_MINUTES))
                .user(dbUser)
                .build();
        confirmationTokenService.save(token);

        return token.getToken();
    }

    public String[] getUserRolesAsStringArray(UserDetails user) {
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        String[] roles = new String[authorities.size()];

        int i = 0;
        for (GrantedAuthority authority : authorities) {
            roles[i] = authority.getAuthority();
            i++;
        }
        return roles;
    }
}
