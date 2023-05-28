package pl.edu.agh.student.rentsys.user;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String USER_NOT_FOUND = "Username %s not found";
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND, username)));
    }

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
        userRepository.save(user);

        return "link";
    }
}
