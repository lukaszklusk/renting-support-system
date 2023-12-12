package pl.edu.agh.student.rentsys.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.UserService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
public class AgreementController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final ApartmentService apartmentService;
    @Autowired
    private final AgreementService agreementService;

    @PatchMapping("/user/{username}/agreements/{aid}")
    public ResponseEntity<AgreementDTO> changeAgreementStatus(@PathVariable String username,
                                                              @PathVariable long aid,
                                                              @RequestParam boolean status,
                                                              @RequestParam boolean byOwner){
        Agreement updatedAgreement = agreementService.changeAgreementStatus(username, aid, status, byOwner);
        AgreementDTO updatedAgreementDTO = AgreementDTO.convertFromAgreement(updatedAgreement);
        return ResponseEntity.ok(updatedAgreementDTO);
    }

    @GetMapping("/user/{username}/agreements")
    public ResponseEntity<List<AgreementDTO>> getAllAgreementsForUser(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            if(userOptional.get().getUserRole().equals(UserRole.OWNER))
                return ResponseEntity.ok(agreementService.getAgreementsForOwner(userOptional.get()).stream().map(AgreementDTO::convertFromAgreement).collect(Collectors.toList()));
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

    @GetMapping("/user/{username}/apartments/{aid}/agreements")
    public ResponseEntity<List<AgreementDTO>> getAgreementsForApartment(@PathVariable String username,
                                                                        @PathVariable long aid){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isEmpty()) return ResponseEntity.notFound().build();
        else{
            Optional<Apartment> apartmentOptional = apartmentService.getApartmentById(aid);
            return apartmentOptional.map(apartment -> ResponseEntity.ok(
                    agreementService.getAgreementsForApartment(apartment).stream()
                            .map(AgreementDTO::convertFromAgreement)
                            .collect(Collectors.toList()))
            ).orElseGet(() -> ResponseEntity.notFound().build());
        }
    }

        @PostMapping("/user/{username}/agreements")
    public ResponseEntity<AgreementDTO> createAgreement(@PathVariable String username,
                                                        @RequestBody AgreementDTO agreementDTO) {
            try {
                Agreement agreement = agreementService.createAgreement(username, agreementDTO);
                AgreementDTO createdAgreementDTO = AgreementDTO.convertFromAgreement(agreement);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdAgreementDTO);
            } catch (EntityNotFoundException e) {
                return ResponseEntity.notFound().build();
            }
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
                        Optional<Apartment> apartment = apartmentService.getApartmentById(
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
