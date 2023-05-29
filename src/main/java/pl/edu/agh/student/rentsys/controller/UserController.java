package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    private UserService userService;
    private ApartmentService apartmentService;

    public UserController(UserService userService,
                          ApartmentService apartmentService) {
        this.userService = userService;
        this.apartmentService = apartmentService;
    }

    @GetMapping("/a")
    public String printA(){
        return "A";
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user/{uid}")
    public ResponseEntity<User> getUserById(@PathVariable long uid){
        Optional<User> userOptional = userService.getUserById(uid);
        if(userOptional.isPresent()) return ResponseEntity.ok(userOptional.get());
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{uid}/apartment")
    public ResponseEntity<List<Apartment>> getAllApartmentsForUser(@PathVariable long uid){
        Optional<User> userOptional = userService.getUserById(uid);
        if(userOptional.isPresent()){
            return ResponseEntity.ok(apartmentService.getApartmentsForUser(userOptional.get()));
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{uid}/apartment/{aid}")
    public ResponseEntity<Apartment> getUserApartment(@PathVariable long uid, @PathVariable long aid){
        Optional<User> userOptional = userService.getUserById(uid);
        if (userOptional.isPresent()) {
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()) return ResponseEntity.ok(apartmentOptional.get());
            else return ResponseEntity.notFound().build();
        }
        else return ResponseEntity.notFound().build();
    }

    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> payload){
        if(!payload.containsKey("username") || !payload.containsKey("password") ||
                !payload.containsKey("email") || !payload.containsKey("phoneNumber")){
            return ResponseEntity.badRequest().build();
        }
        User newUser = new User();
        newUser.setUsername((String) payload.get("username"));
        newUser.setPassword((String) payload.get("password"));
        newUser.setEmail((String) payload.get("email"));
        newUser.setPhoneNumber((String) payload.get("phoneNumber"));
        User user = userService.createNewUser(newUser);
        if(user != null){
            return ResponseEntity.ok(user);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }
}
