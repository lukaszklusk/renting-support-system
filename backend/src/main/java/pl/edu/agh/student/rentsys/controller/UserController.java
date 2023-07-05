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
            if(userOptional.get().getUserRole().equals(UserRole.OWNER))
                return ResponseEntity.ok(apartmentService.getApartmentsForUser(userOptional.get()));
            else if(userOptional.get().getUserRole().equals(UserRole.CLIENT)){
                List<Apartment> apartments = new ArrayList<>();
                agreementService.getAgreementsForClientWithStatus(
                        userOptional.get(),AgreementStatus.active).forEach(
                                t -> apartments.add(t.getApartment()));
                agreementService.getAgreementsForClientWithStatus(
                        userOptional.get(),AgreementStatus.accepted).forEach(
                        t -> apartments.add(t.getApartment()));
                return ResponseEntity.ok(apartments);
            } else return ResponseEntity.badRequest().build();
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartment/{aid}/rented")
    public ResponseEntity<Map<String,Boolean>> checkIfApartmentRented(@PathVariable String username,
                                                                     @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()){
                List<Agreement> agreements = agreementService.getAgreementsForApartment(apartmentOptional.get());
                for(Agreement a: agreements){
                    if(a.getAgreementStatus().equals(AgreementStatus.active) || a.getAgreementStatus().equals(AgreementStatus.accepted)) {
                        return ResponseEntity.ok(new HashMap<>(){{put("rented",true);}});
                    }
                }
                return ResponseEntity.ok(new HashMap<>(){{put("rented",false);}});
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
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

    @PatchMapping("/user/{username}/agreement/{aid}")
    public ResponseEntity<Agreement> changeAgreementStatus(@PathVariable String username,
                                                           @PathVariable long aid,
                                                           @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("agreementStatus")) return ResponseEntity.badRequest().build();
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
            if(agreementOptional.isPresent()){
                try {
                    AgreementStatus agreementStatus =
                            AgreementStatus.valueOf((String) payload.get("agreementStatus"));
                    return ResponseEntity.ok(agreementService.changeAgreementStatus(
                            agreementOptional.get(), agreementStatus));
                }catch (IllegalArgumentException e){
                    return ResponseEntity.badRequest().build();
                }
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
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

    @GetMapping("/user/{username}/agreement/status/{status}")
    public ResponseEntity<List<Agreement>> getAllAgreementsForUserWithStatus(@PathVariable String username,
                                                                             @PathVariable String status){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try {
                AgreementStatus agreementStatus = AgreementStatus.valueOf(status);
                if (userOptional.get().getUserRole().equals(UserRole.OWNER))
                    return ResponseEntity.ok(agreementService.getAgreementsForOwnerWithStatus(userOptional.get(),agreementStatus));
                else if (userOptional.get().getUserRole().equals(UserRole.CLIENT))
                    return ResponseEntity.ok(agreementService.getAgreementsForClientWithStatus(userOptional.get(),agreementStatus));
                else return ResponseEntity.badRequest().build();
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
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

    @PostMapping("/user/{username}/apartment")
    public ResponseEntity<Apartment> createApartment(@PathVariable String username,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("apartmentName") || !payload.containsKey("address") ||
                !payload.containsKey("city") || !payload.containsKey("postalCode") ||
                !payload.containsKey("latitude") || !payload.containsKey("longitude") ||
                !payload.containsKey("size") || !payload.containsKey("description") ||
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
        newApartment.setLatitude(Double.parseDouble((String) payload.get("latitude")));
        newApartment.setLongitude(Double.parseDouble((String) payload.get("longitude")));
        newApartment.setSize(Double.parseDouble((String) payload.get("size")));
        newApartment.setCity((String) payload.get("city"));
        newApartment.setPostalCode((String) payload.get("postalCode"));
        newApartment.setDescription((String) payload.get("description"));
        Set<Picture> pictureSet = new HashSet<>();
        for(Map<String, Object> payloadPic: (List<Map<String, Object>>) payload.get("pictures")){
            if(!payloadPic.containsKey("name") || !payloadPic.containsKey("image"))
                return ResponseEntity.badRequest().build();
            Picture picture = new Picture();
            picture.setName((String) payloadPic.get("name"));
            picture.setImage(Base64.getMimeDecoder().decode((String) payloadPic.get("image")));
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
                !payload.containsKey("administrationFee") || !payload.containsKey("ownerAccountNo") ||
                !payload.containsKey("apartment") || !payload.containsKey("signingDate") ||
                !payload.containsKey("expirationDate") || !payload.containsKey("tenant")){
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
        newAgreement.setMonthlyPayment((Double) payload.get("monthlyPayment"));
        newAgreement.setAdministrationFee((Double) payload.get("administrationFee"));
        newAgreement.setOwnerAccountNo((String) payload.get("ownerAccountNo"));
        Optional<User> tenant = userService.getUserByUsername((String) payload.get("tenant"));
        if(tenant.isPresent()) newAgreement.setTenant(tenant.get());
        else return ResponseEntity.notFound().build();
        Agreement agreement = agreementService.createAgreement(newAgreement);
        if(agreement != null) return ResponseEntity.ok(agreement);
        else return ResponseEntity.internalServerError().build();
    }

    @PutMapping("/user/{username}/agreement/{agid}")
    public ResponseEntity<Agreement> changeAgreement(@PathVariable String username,
                                                     @PathVariable long agid,
                                                     @RequestBody Map<String,Object> payload){
        if(!payload.containsKey("name") && !payload.containsKey("monthlyPayment") &&
                !payload.containsKey("administrationFee") && !payload.containsKey("ownerAccountNo") &&
                !payload.containsKey("apartment") && !payload.containsKey("signingDate") &&
                !payload.containsKey("expirationDate") && !payload.containsKey("tenant")){
            return ResponseEntity.badRequest().build();
        }
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.CLIENT)){
                return ResponseEntity.badRequest().build();
            }else {
                Optional<Agreement> agreementOptional = agreementService.getAgreementById(agid);
                if(agreementOptional.isPresent()){
                    Agreement agreement = agreementOptional.get();
                    if(payload.containsKey("name")) agreement.setName((String) payload.get("name"));
                    if(payload.containsKey("apartment")) {
                        if (!((Map<String, Object>) payload.get("apartment")).containsKey("id"))
                            return ResponseEntity.badRequest().build();
                        Optional<Apartment> apartment = apartmentService.getApartment(
                                Long.valueOf((Integer) ((Map<String, Object>) payload.get("apartment")).get("id")));
                        if (apartment.isEmpty()) return ResponseEntity.notFound().build();
                        agreement.setApartment(apartment.get());
                    }
                    if(payload.containsKey("signingDate")) agreement.setSigningDate(
                            LocalDate.parse((String) payload.get("signingDate"),
                                    DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    if(payload.containsKey("expirationDate")) agreement.setExpirationDate(
                            LocalDate.parse((String) payload.get("expirationDate"),
                            DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    if(payload.containsKey("monthlyPayment"))
                        agreement.setMonthlyPayment((Double) payload.get("monthlyPayment"));
                    if(payload.containsKey("administrationFee"))
                        agreement.setAdministrationFee((Double) payload.get("administrationFee"));
                    if(payload.containsKey("tenant")) {
                        Optional<User> tenant = userService.getUserByUsername((String) payload.get("tenant"));
                        if (tenant.isPresent()) agreement.setTenant(tenant.get());
                        else return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok(agreementService.changeAgreement(agreement));
                } else return ResponseEntity.notFound().build();
            }
        } else return ResponseEntity.notFound().build();
    }
}
