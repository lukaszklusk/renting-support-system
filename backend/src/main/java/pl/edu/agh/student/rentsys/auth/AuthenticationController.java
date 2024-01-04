package pl.edu.agh.student.rentsys.auth;

import ch.qos.logback.classic.Logger;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.auth.requests.SignInRequest;
import pl.edu.agh.student.rentsys.auth.requests.SignUpRequest;

@RestController
@RequestMapping()
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final Logger logger = (Logger) LoggerFactory.getLogger(AuthenticationController.class);

    private final AuthenticationService authenticationService;

    @PostMapping(path = "/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest request, BindingResult bindingResult) {
//        TODO
        if(bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request");
        }
        logger.info("Signup: user -> " + request.getUsername() + " role -> " + request.getRole());

        authenticationService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User signed up successful");
    }

    @GetMapping("/activate")
    public ResponseEntity<?> activateUser(@RequestParam String token) {
        authenticationService.activateUser(token);
        return ResponseEntity.ok("Account activated successfully");
    }

    @PostMapping(path = "/sign-in")
    public void signIn(@RequestBody SignInRequest request, HttpServletResponse response) {
        logger.info("Login: user -> " + request.getUsername());
        authenticationService.signIn(request, response);
    }

    @PostMapping("/sign-out")
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.signOut(request, response);
    }

    @GetMapping("/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.refreshToken(request, response);
    }
}
