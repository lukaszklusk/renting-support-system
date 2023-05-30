package pl.edu.agh.student.rentsys.controller;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.ClientService;
import pl.edu.agh.student.rentsys.service.UserService;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
public class UserController {

    private UserService userService;
    private ApartmentService apartmentService;
    private AgreementService agreementService;
    private ClientService clientService;

    public UserController(UserService userService,
                          ApartmentService apartmentService,
                          AgreementService agreementService,
                          ClientService clientService) {
        this.userService = userService;
        this.apartmentService = apartmentService;
        this.agreementService = agreementService;
        this.clientService = clientService;
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

    @GetMapping("/user/{uid}/agreement")
    public ResponseEntity<List<Agreement>> getAllAgreementsForUser(@PathVariable long uid){
        Optional<User> userOptional = userService.getUserById(uid);
        if(userOptional.isPresent()){
            return ResponseEntity.ok(agreementService.getAgreementForUser(userOptional.get()));
        }else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{uid}/agreement/{agid}")
    public ResponseEntity<Agreement> getAgreementForUserById(@PathVariable long uid,
                                                             @PathVariable long agid){
        Optional<User> userOptional = userService.getUserById(uid);
        if(userOptional.isPresent()){
            Optional<Agreement> agreementOptional = agreementService.getAgreementById(agid);
            if(agreementOptional.isPresent()) return ResponseEntity.ok(agreementOptional.get());
            else return ResponseEntity.notFound().build();
        }else return ResponseEntity.notFound().build();
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
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/user/{uid}/apartment")
    public ResponseEntity<Apartment> createApartment(@PathVariable long uid,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("apartmentName") || !payload.containsKey("address") ||
                !payload.containsKey("coordinatesX") || !payload.containsKey("coordinatesY") ||
                !payload.containsKey("equipment") || !payload.containsKey("properties") ||
                !payload.containsKey("pictures")){
            return ResponseEntity.badRequest().build();
        }
        if(!(payload.get("pictures") instanceof ArrayList)) //TODO finish json validation
            return ResponseEntity.badRequest().build();
        Apartment newApartment = new Apartment();
        Optional<User> owner = userService.getUserById(uid);
        if(owner.isEmpty()) return ResponseEntity.notFound().build();
        newApartment.setOwner(owner.get());
        newApartment.setAddress((String) payload.get("address"));
        newApartment.setName((String) payload.get("apartmentName"));
        newApartment.setCoordinatesX((Double) payload.get("coordinatesX"));
        newApartment.setCoordinatesY((Double) payload.get("coordinatesY"));
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

    @PostMapping("/user/{uid}/agreement")
    public ResponseEntity<Agreement> createAgreement(@PathVariable long uid,
                                                     @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("name") || !payload.containsKey("monthlyPayment") ||
                !payload.containsKey("apartment") || !payload.containsKey("signingDate") ||
                !payload.containsKey("expirationDate") || !payload.containsKey("tenants")){
            return ResponseEntity.badRequest().build();
        }
        Agreement newAgreement = new Agreement();
        Optional<User> owner = userService.getUserById(uid);
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
        Set<Client> tenantSet = new HashSet<>();
        for(Map<String,Object> payloadClient: (List<Map<String,Object>>) payload.get("tenants")){
            if(!payloadClient.containsKey("id")) return ResponseEntity.badRequest().build();
            Optional<Client> client = clientService.getClientById(Long.valueOf((Integer)payloadClient.get("id")));
            if(client.isEmpty()) return ResponseEntity.notFound().build();
            tenantSet.add(client.get());
        }
        newAgreement.setTenants(tenantSet);
        Agreement agreement = agreementService.createAgreement(newAgreement);
        if(agreement != null) return ResponseEntity.ok(agreement);
        else return ResponseEntity.internalServerError().build();
    }
}
