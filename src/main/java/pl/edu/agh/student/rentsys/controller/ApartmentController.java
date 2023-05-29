package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.service.ApartmentService;

import java.util.List;
import java.util.Optional;

@RestController
public class ApartmentController {

    private ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @GetMapping("/apartments")
    public ResponseEntity<List<Apartment>> getAllApartments(){
        return ResponseEntity.ok(apartmentService.getAllApartments());
    }

    @GetMapping("/apartments/{id}")
    public ResponseEntity<Apartment> getApartmentById(@PathVariable long id){
        Optional<Apartment> apartmentOptional = apartmentService.getApartment(id);
        if(apartmentOptional.isPresent()) return ResponseEntity.ok(apartmentOptional.get());
        else return ResponseEntity.notFound().build();
    }
}
