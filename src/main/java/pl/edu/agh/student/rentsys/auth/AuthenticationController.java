package pl.edu.agh.student.rentsys.auth;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
@AllArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping(path = "/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request) {
        try {
            authenticationService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Registration successful.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred during registration.");
        }
    }

    @PostMapping(path = "/signIn")
    public ResponseEntity<SignInResponse> signIn(@RequestBody SignInRequest request) {
        try {
            SignInResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/confirm")
    public ResponseEntity<?> activateUser(@RequestParam String token) {
        try {
            authenticationService.activateUser(token);
            return ResponseEntity.ok("Account activated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred during account activation.");
        }
    }
}
