package pl.edu.agh.student.rentsys.controller;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.EquipmentService;
import pl.edu.agh.student.rentsys.service.UserService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
    public ResponseEntity<User> getUserById(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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

//    @PatchMapping("/user/{username}/apartments/{aid}/equipments")
//    public ResponseEntity<Set<EquipmentDTO>> getApartmentEquipment(@PathVariable String username,
//                                                                   @PathVariable long aid,
//                                                                   @RequestParam String status){
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        if(userOptional.isPresent()){
//            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
//            if(agreementOptional.isPresent()){
//                try {
//                    equipmentService.createEquipment()
//                    AgreementStatus agreementStatus =
//                            AgreementStatus.valueOf(status);
//                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreementStatus(
//                            agreementOptional.get(), agreementStatus)));
//                }catch (IllegalArgumentException e){
//                    return ResponseEntity.badRequest().build();
//                }
//            } else return ResponseEntity.notFound().build();
//        } else return ResponseEntity.notFound().build();
//    }

//    @PatchMapping("/user/{username}/agreements/{aid}")
//    public ResponseEntity<AgreementDTO> changeAgreementStatus(@PathVariable String username,
//                                                              @PathVariable long aid,
//                                                              @RequestParam String status){
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        if(userOptional.isPresent()){
//            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
//            if(agreementOptional.isPresent()){
//                try {
//                    AgreementStatus agreementStatus =
//                            AgreementStatus.valueOf(status);
//                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreementStatus(
//                            agreementOptional.get(), agreementStatus)));
//                }catch (IllegalArgumentException e){
//                    return ResponseEntity.badRequest().build();
//                }
//            } else return ResponseEntity.notFound().build();
//        } else return ResponseEntity.notFound().build();
//    }
}
