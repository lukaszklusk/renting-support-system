package pl.edu.agh.student.rentsys.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.ApartmentRepository;
import pl.edu.agh.student.rentsys.repository.EquipmentRepository;

import java.util.*;

@Service
@AllArgsConstructor
public class EquipmentService {
    @Autowired
    private final EquipmentRepository equipmentRepository;
    @Autowired
    private final ApartmentService apartmentService;
    @Autowired
    private final ApartmentRepository apartmentRepository;
    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private final UserService userService;

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

    public Equipment createEquipment(String username, Long aid, EquipmentDTO equipmentDTO) {
        Apartment endpointApartment = apartmentService.getApartmentFromUsernameAndId(username, aid);
        Apartment apartment = apartmentService.getApartmentById(equipmentDTO.getApartmentId()).orElseThrow(() -> new EntityNotFoundException("Apartment not found"));
        if (apartment != endpointApartment) {
            throw new IllegalStateException();
        }
        Equipment equipment = createEquipment(equipmentDTO.getName(), equipmentDTO.getDescription(), apartment);

        Notification notification = notificationService.createAndSendNotification(
                apartment.getOwner(), null, NotificationType.equipment_added, NotificationPriority.important, equipment.getName()
        );
        equipment.addNotification(notification);
        return equipmentRepository.save(equipment);
    }

    public Equipment changeEquipmentStatus(String username, long aid, long eid, Boolean status) {
        Apartment apartmentFromId = apartmentService.getApartmentById(aid).orElseThrow(() -> new EntityNotFoundException(String.format("Apartment with id %d was not found", aid)));
        Apartment apartmentFromEquipmentId = getEquipmentById(eid).map(Equipment::getApartment).orElseThrow(() -> new EntityNotFoundException(String.format("Apartment with id %d was not found", aid)));
        if (apartmentFromId != apartmentFromEquipmentId) {
            throw new IllegalStateException();
        }

        Equipment equipment = getEquipmentById(eid).orElseThrow(() -> new EntityNotFoundException(String.format("Equipment with id %d was not found", aid)));
        if (equipment.getIsBroken() != status) {
            throw new IllegalStateException();
        }

        equipment.setIsBroken(!status);
        NotificationType modifiedEquipment =  status.equals(true) ? NotificationType.equipment_fix : NotificationType.equipment_failure;
        User sender = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(""));
        User receiver = apartmentFromId.getOwner() == sender ? apartmentFromId.getTenant() : apartmentFromId.getOwner();
        Notification notification = notificationService.createAndSendNotification(
                sender, receiver, modifiedEquipment, NotificationPriority.important, equipment.getName()
        );
        equipment.addNotification(notification);
        return equipmentRepository.save(equipment);
    }
}
