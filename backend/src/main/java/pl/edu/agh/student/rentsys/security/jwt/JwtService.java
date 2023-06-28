package pl.edu.agh.student.rentsys.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.user.UserService;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static pl.edu.agh.student.rentsys.security.jwt.JwtConfig.*;

@Service
@AllArgsConstructor
public class JwtService {

    private final UserService userService;

    public Optional<String> extractTokenByName(HttpServletRequest request, String tokenName) {
        return getCookieValueByName(request, tokenName);
   }

    public String generateAccessToken(UserDetails userDetails) {
        return generateAccessToken(new HashMap<>(), userDetails);
    }
    public String generateAccessToken(Map<String, Object> claims, UserDetails userDetails) {
        return buildToken(claims, userDetails, JWT_ACCESS_TOKEN_VALID_TIME_IN_MS);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, JWT_REFRESH_TOKEN_VALID_TIME_IN_MS);
    }

    public String buildToken(Map<String, Object> claims, UserDetails userDetails, long expirationTimeInMs) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeInMs))
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

    private Optional<String> getCookieValueByName(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(cookieName)) {
                    return Optional.of(cookie.getValue());
                }
            }
        }
        return Optional.empty();
    }
}
