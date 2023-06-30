package pl.edu.agh.student.rentsys.tests;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserRepository;


@Component
@AllArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create three example users
        createUser("client@mail.com", "client", "client", UserRole.CLIENT);
        createUser("owner@mail.com", "owner", "owner", UserRole.OWNER);
        createUser("admin@mail.com", "admin", "admin", UserRole.ADMIN);
    }

    private void createUser(String email, String username, String password, UserRole role) {
        var user = User.builder()
                .email(email)
                .username(username)
                .userRole(role)
                .password(passwordEncoder.encode(password))
                .locked(false)
                .enabled(true)
                .build();

        userRepository.save(user);
    }
}

