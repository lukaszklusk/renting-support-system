package pl.edu.agh.student.rentsys.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.Equipment;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.repository.EquipmentRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class EquipmentService {
    @Autowired
    private final EquipmentRepository equipmentRepository;

    public Optional<Equipment> getEquipmentById(Long id){
        return equipmentRepository.findById(id);
    }
    public List<Equipment> getEquipmentsByApartment(Apartment apartment) {return equipmentRepository.findAllByApartment(apartment);}

    public Equipment createEquipment(String name, String description, Apartment apartment) {
        return Equipment.builder()
                .name(name)
                .description(description)
                .apartment(apartment)
                .isBroken(false)
                .notifications(new HashSet<>())
                .build();
    }
}
