package pl.edu.agh.student.rentsys.controller;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.UserDTO;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.UserService;

import java.util.*;

@RestController
@AllArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;
    @Autowired
    private final PasswordEncoder passwordEncoder;


    @GetMapping("/test")
    public String test(){
        return "ok";
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username){
       UserDTO userDTO = userService.getByUsername(username);
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }

    @PostMapping("/user")
    public ResponseEntity<Map<String,Object>> createUser(@RequestBody Map<String, Object> payload){
        if(!payload.containsKey("username") || !payload.containsKey("password") ||
                !payload.containsKey("email") || !payload.containsKey("phoneNumber") ||
                !payload.containsKey("role") || !payload.containsKey("firstName") ||
                !payload.containsKey("lastName")){
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> response = new HashMap<>();
        User newUser = User.builder()
                .username((String) payload.get("username"))
                .password(passwordEncoder.encode((String) payload.get("password")))
                .email((String) payload.get("email"))
                .userRole(UserRole.valueOf((String) payload.get("role")))
                .firstName((String) payload.get("firstName"))
                .lastName((String) payload.get("lastName"))
                .locked(false)
                .enabled(true)
                .build();
        response.put("user", newUser);
        String token = userService.signUp(newUser);
        if(token != null){
            response.put("token", token);
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

}
