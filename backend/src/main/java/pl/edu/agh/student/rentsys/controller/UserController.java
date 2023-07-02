package pl.edu.agh.student.rentsys.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
public class UserController {

    private UserService userService;
    private ApartmentService apartmentService;
    private AgreementService agreementService;
    private final PasswordEncoder passwordEncoder;


    public UserController(UserService userService,
                          ApartmentService apartmentService,
                          AgreementService agreementService,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.apartmentService = apartmentService;
        this.agreementService = agreementService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/a")
    public String printA(){
        return "A";
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<User> getUserById(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()) return ResponseEntity.ok(userOptional.get());
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartment")
    public ResponseEntity<List<Apartment>> getAllApartmentsForUser(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            return ResponseEntity.ok(apartmentService.getApartmentsForUser(userOptional.get()));
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartment/{aid}")
    public ResponseEntity<Apartment> getUserApartment(@PathVariable String username, @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isPresent()) {
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()) return ResponseEntity.ok(apartmentOptional.get());
            else return ResponseEntity.notFound().build();
        }
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/agreement")
    public ResponseEntity<List<Agreement>> getAllAgreementsForUser(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.OWNER))
                return ResponseEntity.ok(agreementService.getAgreementForUser(userOptional.get()));
            else if(userOptional.get().getUserRole().equals(UserRole.CLIENT))
                return ResponseEntity.ok(agreementService.getAgreementsForClient(userOptional.get()));
            else return ResponseEntity.badRequest().build();
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/agreement/{agid}")
    public ResponseEntity<Agreement> getAgreementForUserById(@PathVariable String username,
                                                             @PathVariable long agid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(agid);
            if(agreementOptional.isPresent()) return ResponseEntity.ok(agreementOptional.get());
            else return ResponseEntity.notFound().build();
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartment/{aid}/agreement")
    public ResponseEntity<List<Agreement>> getAgreementsForApartment(@PathVariable String username,
                                                                     @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isEmpty()) return ResponseEntity.notFound().build();
        else{
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()){
                return ResponseEntity.ok(agreementService.getAgreementsForApartment(apartmentOptional.get()));
            }else return ResponseEntity.notFound().build();
        }
    }



    @PostMapping("/user")
    public ResponseEntity<Map<String,Object>> createUser(@RequestBody Map<String, Object> payload){
        if(!payload.containsKey("username") || !payload.containsKey("password") ||
                !payload.containsKey("email") || !payload.containsKey("phoneNumber") ||
                !payload.containsKey("role")){
            return ResponseEntity.badRequest().build();
        }

        Map<String, Object> response = new HashMap<>();
        User newUser = User.builder()
                .username((String) payload.get("username"))
                .password(passwordEncoder.encode((String) payload.get("password")))
                .email((String) payload.get("email"))
                .userRole(UserRole.valueOf((String) payload.get("role")))
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

    @PostMapping("/user/{username}/apartment")
    public ResponseEntity<Apartment> createApartment(@PathVariable String username,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("apartmentName") || !payload.containsKey("address") ||
                !payload.containsKey("latitude") || !payload.containsKey("longitude") ||
                !payload.containsKey("equipment") || !payload.containsKey("properties") ||
                !payload.containsKey("pictures")){
            return ResponseEntity.badRequest().build();
        }
        if(!(payload.get("pictures") instanceof ArrayList)) //TODO finish json validation
            return ResponseEntity.badRequest().build();
        Apartment newApartment = new Apartment();
        Optional<User> owner = userService.getUserByUsername(username);
        if(owner.isEmpty()) return ResponseEntity.notFound().build();
        newApartment.setOwner(owner.get());
        newApartment.setAddress((String) payload.get("address"));
        newApartment.setName((String) payload.get("apartmentName"));
        newApartment.setLatitude((Double) payload.get("latitude"));
        newApartment.setLongitude((Double) payload.get("longitude"));
        Set<Picture> pictureSet = new HashSet<>();
        for(Map<String, Object> payloadPic: (List<Map<String, Object>>) payload.get("pictures")){
            if(!payloadPic.containsKey("name") || !payloadPic.containsKey("image"))
                return ResponseEntity.badRequest().build();
            Picture picture = new Picture();
            picture.setName((String) payloadPic.get("name"));
            picture.setImage(Base64.getDecoder().decode((String) payloadPic.get("image")));
            pictureSet.add(picture);
        }
        newApartment.setPictures(pictureSet);
        Set<Equipment> equipmentSet = new HashSet<>();
        for (Map<String, Object> payloadEq: (List<Map<String, Object>>) payload.get("equipment")){
            if(!payloadEq.containsKey("name") || !payloadEq.containsKey("description"))
                return ResponseEntity.badRequest().build();
            Equipment equipment = new Equipment();
            equipment.setName((String) payloadEq.get("name"));
            equipment.setDescription((String) payloadEq.get("description"));
            equipmentSet.add(equipment);
        }
        newApartment.setEquipment(equipmentSet);
        Set<ApartmentProperty> propertySet = new HashSet<>();
        for(Map<String, Object> payloadProp: (List<Map<String, Object>>) payload.get("properties")){
            if(!payloadProp.containsKey("name") || !payloadProp.containsKey("valueType") ||
                    !payloadProp.containsKey("value"))
                return ResponseEntity.badRequest().build();
            ApartmentProperty property = new ApartmentProperty();
            property.setName((String) payloadProp.get("name"));
            property.setValueType((String) payloadProp.get("valueType"));
            property.setValue((String) payloadProp.get("value"));
            propertySet.add(property);
        }
        newApartment.setProperties(propertySet);
        Apartment apartment = apartmentService.createApartment(newApartment);
        if(apartment != null){
            return ResponseEntity.ok(apartment);
        }
        else return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/user/{username}/agreement")
    public ResponseEntity<Agreement> createAgreement(@PathVariable String username,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("name") || !payload.containsKey("monthlyPayment") ||
                !payload.containsKey("apartment") || !payload.containsKey("signingDate") ||
                !payload.containsKey("expirationDate") || !payload.containsKey("tenants")){
            return ResponseEntity.badRequest().build();
        }
        Agreement newAgreement = new Agreement();
        Optional<User> owner = userService.getUserByUsername(username);
        if(owner.isEmpty()) return ResponseEntity.notFound().build();
        newAgreement.setOwner(owner.get());
        newAgreement.setName((String) payload.get("name"));
        if(!((Map<String,Object>) payload.get("apartment")).containsKey("id")) return ResponseEntity.badRequest().build();
        Optional<Apartment> apartment = apartmentService.getApartment(
                Long.valueOf((Integer)((Map<String,Object>) payload.get("apartment")).get("id")));
        if(apartment.isEmpty()) return ResponseEntity.notFound().build();
        newAgreement.setApartment(apartment.get());
        newAgreement.setSigningDate(LocalDate.parse((String) payload.get("signingDate"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        newAgreement.setExpirationDate(LocalDate.parse((String) payload.get("expirationDate"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        Set<User> tenantSet = new HashSet<>();
        for(Map<String,Object> payloadClient: (List<Map<String,Object>>) payload.get("tenants")){
            if(!payloadClient.containsKey("username")) return ResponseEntity.badRequest().build();
            Optional<User> client = userService.getUserByUsername(((String) payloadClient.get("username")));
            if(client.isEmpty()) return ResponseEntity.notFound().build();
            tenantSet.add(client.get());
        }
        //newAgreement.setTenant(tenantSet);
        Agreement agreement = agreementService.createAgreement(newAgreement);
        if(agreement != null) return ResponseEntity.ok(agreement);
        else return ResponseEntity.internalServerError().build();
    }
}
