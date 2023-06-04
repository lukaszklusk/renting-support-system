package pl.edu.agh.student.rentsys.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static pl.edu.agh.student.rentsys.security.jwt.JwtConfig.*;

@Service
@AllArgsConstructor
public class JwtService {

    public String extractToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_HEADER)) {
            return null;
        }
        return authorizationHeader.replace(TOKEN_HEADER, "");
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(java.sql.Date.valueOf(LocalDate.now().plusDays(JWT_TOKEN_VALID_TIME_IN_DAYS)))
                .signWith(getEncryptionKey(), ENCRYPTION_ALGORITHM)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validate(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        Date tokenExpirationDate = extractExpiration(token);
        boolean isTokenActive = tokenExpirationDate.after(new Date());
        return isTokenActive && username.equals(userDetails.getUsername());
    }

    private Date  extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(JwtConfig.getEncryptionKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
