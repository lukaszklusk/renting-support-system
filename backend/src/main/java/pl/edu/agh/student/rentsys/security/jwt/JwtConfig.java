package pl.edu.agh.student.rentsys.security.jwt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Configuration;

import java.security.Key;

@Configuration
public class JwtConfig {
    static final String TOKEN_HEADER = "Bearer ";
    private static final String ENCRYPTION_KEY = "4E635266556A586E3272357538782F413F4428472D4B6150645367566B597033";
    public static final long JWT_ACCESS_TOKEN_VALID_TIME_IN_MS = 86400000; // 1 day
//    public static final long JWT_ACCESS_TOKEN_VALID_TIME_IN_MS = 60000; // 1 minute
    public static final long JWT_REFRESH_TOKEN_VALID_TIME_IN_MS = 604800000; // 7 days
    public static final SignatureAlgorithm ENCRYPTION_ALGORITHM = SignatureAlgorithm.HS256;

    public static Key getEncryptionKey() {
        byte[] bytes = Decoders.BASE64.decode(ENCRYPTION_KEY);
        return Keys.hmacShaKeyFor(bytes);
    }
}
