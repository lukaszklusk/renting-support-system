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

import java.util.*;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
public class ApartmentController {

    @Autowired
    private final ApartmentService apartmentService;
    @Autowired
    private final AgreementService agreementService;
    @Autowired
    private final UserService userService;


    @GetMapping("/apartments")
    public ResponseEntity<List<ApartmentDTO>> getAllApartments(){
        return ResponseEntity.ok(
                apartmentService.getAllApartments().stream()
                        .map(ApartmentDTO::convertFromApartment)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/apartments/{id}")
    public ResponseEntity<ApartmentDTO> getApartmentById(@PathVariable long id){
        Optional<ApartmentDTO> apartmentOptional = apartmentService.getApartmentDTO(id);
        return apartmentOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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
                        userOptional.get(), AgreementStatus.active).forEach(
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
            Optional<Apartment> apartmentOptional = apartmentService.getApartmentById(aid);
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

    @PostMapping("/user/{username}/apartments")
    public ResponseEntity<ApartmentDTO> createApartment(@PathVariable String username,
                                                        @RequestBody ApartmentDTO apartmentDTO) {
        try {
            Apartment apartment = apartmentService.createApartment(username, apartmentDTO);
            ApartmentDTO newApartmentDTO = ApartmentDTO.convertFromApartment(apartment);
            return ResponseEntity.status(HttpStatus.CREATED).body(newApartmentDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
