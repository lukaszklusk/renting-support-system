package pl.edu.agh.student.rentsys.controller;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.model.User;
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
    private final ApartmentService apartmentService;
    @Autowired
    private final AgreementService agreementService;
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

    @GetMapping("/user/{username}/apartments")
    public ResponseEntity<List<ApartmentDTO>> getAllApartmentsForUser(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.OWNER))
                return ResponseEntity.ok(
                        apartmentService.getApartmentsForUser(userOptional.get()).stream()
                                .map(ApartmentDTO::convertFromApartment)
                                .collect(Collectors.toList())
                );
            else if(userOptional.get().getUserRole().equals(UserRole.CLIENT)){
                List<Apartment> apartments = new ArrayList<>();
                agreementService.getAgreementsForClientWithStatus(
                        userOptional.get(),AgreementStatus.active).forEach(
                                t -> apartments.add(t.getApartment()));
                agreementService.getAgreementsForClientWithStatus(
                        userOptional.get(),AgreementStatus.accepted).forEach(
                        t -> apartments.add(t.getApartment()));
                return ResponseEntity.ok(apartments.stream()
                        .map(ApartmentDTO::convertFromApartment)
                        .collect(Collectors.toList())
                );
            } else return ResponseEntity.badRequest().build();
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartments/status")
    public ResponseEntity<List<ApartmentDTO>> getApartmentsForUserWithStatus(@PathVariable String username,
                                                                          @RequestParam String status){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.CLIENT))
                return ResponseEntity.badRequest().build();
            List<Apartment> returnList = new ArrayList<>();
            if(status.equals("rented")){
                List<Apartment> apartmentList = apartmentService.getApartmentsForUser(userOptional.get());
                for(Apartment a: apartmentList){
                    List<Agreement> agreements = agreementService.getAgreementsForApartment(a);
                    for(Agreement ag: agreements){
                        if(ag.getAgreementStatus().equals(AgreementStatus.active) || ag.getAgreementStatus().equals(AgreementStatus.accepted)) {
                            returnList.add(a);
                            break;
                        }
                    }
                }
                return ResponseEntity.ok(returnList.stream()
                        .map(ApartmentDTO::convertFromApartment)
                        .collect(Collectors.toList())
                );
            } else if(status.equals("vacant")){
                List<Apartment> apartmentList = apartmentService.getApartmentsForUser(userOptional.get());
                for(Apartment a: apartmentList){
                    List<Agreement> agreements = agreementService.getAgreementsForApartment(a);
                    boolean rented = false;
                    for(Agreement ag: agreements){
                        if(ag.getAgreementStatus().equals(AgreementStatus.active) || ag.getAgreementStatus().equals(AgreementStatus.accepted)) {
                            rented = true;
                            break;
                        }
                    }
                    if(!rented)
                        returnList.add(a);
                }
                return ResponseEntity.ok(returnList.stream()
                        .map(ApartmentDTO::convertFromApartment)
                        .collect(Collectors.toList())
                );
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/apartments/{aid}/rented")
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

    @GetMapping("/user/{username}/apartments/{aid}")
    public ResponseEntity<ApartmentDTO> getUserApartment(@PathVariable String username, @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isPresent()) {
            Optional<ApartmentDTO> apartmentOptional = apartmentService.getApartmentDTO(aid);
            return apartmentOptional.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
        else return ResponseEntity.notFound().build();
    }

    @PatchMapping("/user/{username}/agreements/{aid}")
    public ResponseEntity<AgreementDTO> changeAgreementStatus(@PathVariable String username,
                                                           @PathVariable long aid,
                                                           @RequestParam String status){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
            if(agreementOptional.isPresent()){
                try {
                    AgreementStatus agreementStatus =
                            AgreementStatus.valueOf(status);
                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreementStatus(
                            agreementOptional.get(), agreementStatus)));
                }catch (IllegalArgumentException e){
                    return ResponseEntity.badRequest().build();
                }
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
    }

    @PatchMapping("/user/{username}/agreements/{aid}/accept")
    public ResponseEntity<AgreementDTO> setAgreementStatusToActive(@PathVariable String username,
                                                                @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
            if(agreementOptional.isPresent()){
                try {
                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreementStatus(
                            agreementOptional.get(), AgreementStatus.accepted)));
                }catch (IllegalArgumentException e){
                    return ResponseEntity.badRequest().build();
                }
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
    }

    @PatchMapping("/user/{username}/agreements/{aid}/reject")
    public ResponseEntity<AgreementDTO> setAgreementStatusToRejected(@PathVariable String username,
                                                                @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(aid);
            if(agreementOptional.isPresent()){
                try {
                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreementStatus(
                            agreementOptional.get(), AgreementStatus.rejected)));
                }catch (IllegalArgumentException e){
                    return ResponseEntity.badRequest().build();
                }
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/agreements")
    public ResponseEntity<List<AgreementDTO>> getAllAgreementsForUser(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.OWNER))
                return ResponseEntity.ok(agreementService.getAgreementForUser(userOptional.get()).stream().map(AgreementDTO::convertFromAgreement).collect(Collectors.toList()));
            else if(userOptional.get().getUserRole().equals(UserRole.CLIENT))
                return ResponseEntity.ok(agreementService.getAgreementsForClient(userOptional.get()).stream().map(AgreementDTO::convertFromAgreement).collect(Collectors.toList()));
            else return ResponseEntity.badRequest().build();
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/agreements/status/{status}")
    public ResponseEntity<List<AgreementDTO>> getAllAgreementsForUserWithStatus(@PathVariable String username,
                                                                             @PathVariable String status){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try {
                AgreementStatus agreementStatus = AgreementStatus.valueOf(status);
                if (userOptional.get().getUserRole().equals(UserRole.OWNER))
                    return ResponseEntity.ok(agreementService.getAgreementsForOwnerWithStatus(userOptional.get(),agreementStatus).stream().map(AgreementDTO::convertFromAgreement).collect(Collectors.toList()));
                else if (userOptional.get().getUserRole().equals(UserRole.CLIENT))
                    return ResponseEntity.ok(agreementService.getAgreementsForClientWithStatus(userOptional.get(),agreementStatus).stream().map(AgreementDTO::convertFromAgreement).collect(Collectors.toList()));
                else return ResponseEntity.badRequest().build();
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/agreements/{agid}")
    public ResponseEntity<AgreementDTO> getAgreementForUserById(@PathVariable String username,
                                                             @PathVariable long agid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(agid);
            return agreementOptional.map(AgreementDTO::convertFromAgreement).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        }else return ResponseEntity.notFound().build();
    }

    //    TODO: add agreement by status
    @GetMapping("/user/{username}/apartments/{aid}/agreements")
    public ResponseEntity<List<AgreementDTO>> getAgreementsForApartment(@PathVariable String username,
                                                                     @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isEmpty()) return ResponseEntity.notFound().build();
        else{
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            return apartmentOptional.map(apartment -> ResponseEntity.ok(
                    agreementService.getAgreementsForApartment(apartment).stream()
                            .map(AgreementDTO::convertFromAgreement)
                            .collect(Collectors.toList()))
                    ).orElseGet(() -> ResponseEntity.notFound().build());
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

    @PostMapping("/user/{username}/apartments")
    public ResponseEntity<ApartmentDTO> createApartment(@PathVariable String username,
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
//            picture.setImageData(payloadPic.get("image"));
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
            return ResponseEntity.ok(ApartmentDTO.convertFromApartment(apartment));
        }
        else return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/user/{username}/agreements")
    public ResponseEntity<AgreementDTO> createAgreement(@PathVariable String username,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("name") || !payload.containsKey("monthlyPayment") ||
                !payload.containsKey("administrationFee") || !payload.containsKey("ownerAccountNo") ||
                !payload.containsKey("apartmentId") || !payload.containsKey("signingDate") ||
                !payload.containsKey("expirationDate") || !payload.containsKey("tenant")){
            return ResponseEntity.badRequest().build();
        }
        Agreement newAgreement = new Agreement();
        Optional<User> owner = userService.getUserByUsername(username);
        if(owner.isEmpty()) return ResponseEntity.notFound().build();
        newAgreement.setOwner(owner.get());
        newAgreement.setName((String) payload.get("name"));
        Optional<Apartment> apartment = apartmentService.getApartment(
                Long.parseLong((String) payload.get("apartmentId")));
        if(apartment.isEmpty()) return ResponseEntity.notFound().build();
        newAgreement.setApartment(apartment.get());
        newAgreement.setSigningDate(LocalDate.parse((String) payload.get("signingDate"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        newAgreement.setExpirationDate(LocalDate.parse((String) payload.get("expirationDate"),
                DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        newAgreement.setMonthlyPayment(Double.parseDouble((String) payload.get("monthlyPayment")));
        newAgreement.setAdministrationFee(Double.parseDouble((String) payload.get("administrationFee")));
        newAgreement.setOwnerAccountNo((String) payload.get("ownerAccountNo"));
        Optional<User> tenant = userService.getUserByUsername((String) payload.get("tenant"));
        if(tenant.isPresent()) newAgreement.setTenant(tenant.get());
        else return ResponseEntity.notFound().build();
        Agreement agreement = agreementService.createAgreement(newAgreement);
        if(agreement != null) return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreement));
        else return ResponseEntity.internalServerError().build();
    }

    @PutMapping("/user/{username}/agreements/{agid}")
    public ResponseEntity<AgreementDTO> changeAgreement(@PathVariable String username,
                                                     @PathVariable long agid,
                                                     @RequestBody Map<String,Object> payload){
        if(!payload.containsKey("name") && !payload.containsKey("monthlyPayment") &&
                !payload.containsKey("administrationFee") && !payload.containsKey("ownerAccountNo") &&
                !payload.containsKey("apartmentId") && !payload.containsKey("signingDate") &&
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
                    if(payload.containsKey("apartmentId")) {
                        Optional<Apartment> apartment = apartmentService.getApartment(
                                Long.parseLong((String) payload.get("apartmentId")));
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
                    return ResponseEntity.ok(AgreementDTO.convertFromAgreement(agreementService.changeAgreement(agreement)));
                } else return ResponseEntity.notFound().build();
            }
        } else return ResponseEntity.notFound().build();
    }
}
