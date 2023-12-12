package pl.edu.agh.student.rentsys.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.Equipment;
import pl.edu.agh.student.rentsys.model.EquipmentDTO;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.EquipmentService;
import pl.edu.agh.student.rentsys.service.UserService;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user/{username}/apartments/{aid}/equipments")
@AllArgsConstructor
public class EquipmentController {

    @Autowired
    private final UserService userService;
    @Autowired
    private final ApartmentService apartmentService;
    @Autowired
    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<Set<EquipmentDTO>> getApartmentEquipments(@PathVariable String username,
                                                                    @PathVariable long aid) {

        try {
            Apartment apartment = apartmentService.getApartmentFromUsernameAndId(username, aid);
            Set<EquipmentDTO> equipmentSet = apartment.getEquipment().stream().map(EquipmentDTO::convertFromEquipment).collect(Collectors.toSet());
            return ResponseEntity.ok(equipmentSet);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<EquipmentDTO> createEquipment(@PathVariable String username,
                                                        @PathVariable long aid,
                                                        @RequestBody EquipmentDTO equipmentDTO) {
        try {
            Equipment equipment = equipmentService.createEquipment(username, aid, equipmentDTO);
            EquipmentDTO newEquipmentDTO = EquipmentDTO.convertFromEquipment(equipment);
            return ResponseEntity.status(HttpStatus.CREATED).body(newEquipmentDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{eid}")
    public ResponseEntity<EquipmentDTO> deleteEquipment(@PathVariable String username,
                                                        @PathVariable long aid,
                                                        @PathVariable long eid) {
        try {
            equipmentService.deleteEquipment(username, aid, eid);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{eid}")
    public ResponseEntity<EquipmentDTO> changeEquipmentStatus(@PathVariable String username,
                                                        @PathVariable long aid,
                                                        @PathVariable long eid,
                                                        @RequestParam Boolean status) {
        try {
            Equipment equipment = equipmentService.changeEquipmentStatus(username, aid, eid, status);
            EquipmentDTO newEquipmentDTO = EquipmentDTO.convertFromEquipment(equipment);
            return ResponseEntity.ok(newEquipmentDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
