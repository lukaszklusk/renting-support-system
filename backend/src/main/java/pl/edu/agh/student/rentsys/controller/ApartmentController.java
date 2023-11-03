package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.ApartmentDTO;
import pl.edu.agh.student.rentsys.service.ApartmentService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class ApartmentController {

    private final ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

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
}
