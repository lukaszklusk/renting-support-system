package pl.edu.agh.student.rentsys.auth.token;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.user.User;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ConfirmationTokenService {
    private final ConfirmationTokenRepository tokenRepository;

    public void save(ConfirmationToken token) {
        tokenRepository.save(token);
    }
    public void saveAll(List<ConfirmationToken> tokens) {
        tokenRepository.saveAll(tokens);
    }
    public Optional<ConfirmationToken> getToken(String token){
        return tokenRepository.findByToken(token);
    }
    public List<ConfirmationToken> getUserTokens(User user) {
        return tokenRepository.findAllByUser(user);
    }
}
