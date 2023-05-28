package pl.edu.agh.student.rentsys.registration.token;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ConfirmationTokenService {
    private final ConfirmationTokenRepository tokenRepository;

    public void save(ConfirmationToken token) {
        tokenRepository.save(token);
    }
    public Optional<ConfirmationToken> getToken(String token){
        return tokenRepository.findByToken(token);
    }
}
