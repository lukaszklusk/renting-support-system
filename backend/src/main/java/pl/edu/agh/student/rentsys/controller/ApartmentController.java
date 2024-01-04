package pl.edu.agh.student.rentsys.controller;

import ch.qos.logback.classic.Logger;
import lombok.AllArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    private final Logger logger = (Logger) LoggerFactory.getLogger(ApartmentController.class);

    @Autowired
    private final ApartmentService apartmentService;
    @Autowired
    private final AgreementService agreementService;
    @Autowired
    private final UserService userService;


    @GetMapping("/apartments")
    public ResponseEntity<List<ApartmentDTO>> getAllApartments(){
        logger.info("GET /apartments");
        return ResponseEntity.ok(apartmentService.getAllApartments());
    }

    @GetMapping("/apartments/{id}")
    public ResponseEntity<ApartmentDTO> getApartmentById(@PathVariable long id){
        logger.info("/apartments/" + id);
        return ResponseEntity.ok(apartmentService.getApartmentDTO(id));
    }

    @GetMapping("/user/{username}/apartments")
    public ResponseEntity<List<ApartmentDTO>> getAllApartmentsForUser(@PathVariable String username){
        logger.info("GET /user/"+ username +"/apartments");
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

    @PostMapping("/user/{username}/apartments")
    public ResponseEntity<ApartmentDTO> createApartment(@PathVariable String username,
                                                        @RequestBody ApartmentDTO apartmentDTO) {
        logger.info("POST /user/" + username + "/apartments --- " +
                "apartment -> " + apartmentDTO.toString());
        Apartment apartment = apartmentService.createApartment(username, apartmentDTO);
        ApartmentDTO newApartmentDTO = ApartmentDTO.convertFromApartment(apartment);
        return ResponseEntity.status(HttpStatus.CREATED).body(newApartmentDTO);
    }

    @DeleteMapping("/user/{username}/apartments/{id}")
    public ResponseEntity<ApartmentDTO> deleteApartment(@PathVariable String username,
                                                        @PathVariable long id) {
        logger.info("DELETE /user/" + username + "/apartments/" + id);
        apartmentService.deleteApartment(username, id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
