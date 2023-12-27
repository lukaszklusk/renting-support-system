package pl.edu.agh.student.rentsys.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.ApartmentPropertyRepository;
import pl.edu.agh.student.rentsys.repository.ApartmentRepository;
import pl.edu.agh.student.rentsys.repository.EquipmentRepository;
import pl.edu.agh.student.rentsys.repository.PictureRepository;
import pl.edu.agh.student.rentsys.model.User;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
@AllArgsConstructor
public class ApartmentService {

    @Autowired
    private final UserService userService;
    @Autowired
    private final ApartmentRepository apartmentRepository;
    @Autowired
    private final ApartmentPropertyRepository apartmentPropertyRepository;
    @Autowired
    private final PictureRepository pictureRepository;
    @Autowired
    private final EquipmentRepository equipmentRepository;
    @Autowired
    private final AgreementService agreementService;
    @Autowired
    private final NotificationService notificationService;

    public Apartment createApartment(Apartment apartment){
        apartmentRepository.getApartmentByOwnerAndName(apartment.getOwner(), apartment.getName()).ifPresent(a -> {
            throw new IllegalStateException("Apartment names cannot repeat for the same owner");
        } );

        pictureRepository.saveAll(apartment.getPictures());

        Notification notification = notificationService.createAndSendNotification(apartment.getOwner(), apartment.getTenant(), NotificationType.apartment_created, NotificationPriority.critical, apartment.getName(), "");
        apartment.addNotification(notification);

        Apartment createdApartment = apartmentRepository.save(apartment);

        for (ApartmentProperty property : apartment.getProperties()) {
            property.setApartment(apartment);
        }
        apartmentPropertyRepository.saveAll(apartment.getProperties());

        for (Equipment equipment: createdApartment.getEquipment()) {
            equipment.setApartment(apartment);
        }
        equipmentRepository.saveAll(apartment.getEquipment());
        return createdApartment;
    }

    public void deleteApartment(String username, long id) {
        Apartment apartment = getApartmentFromUsernameAndId(username, id);
        Notification notification = notificationService.createAndSendNotification(apartment.getOwner(), apartment.getTenant(), NotificationType.apartment_removed, NotificationPriority.critical, apartment.getName(), "");
        apartment.addNotification(notification);
        apartment.getPictures().clear();
        apartmentRepository.delete(apartment);
    }

    public Apartment changeApartment(Apartment apartment){
        Optional<Apartment> oldApartmentOpt = apartmentRepository.findById(apartment.getId());
        if(oldApartmentOpt.isEmpty()) return null;
        Apartment oldApartment = oldApartmentOpt.get();
        for(Equipment eq: apartment.getEquipment()){
            if(!oldApartment.getEquipment().contains(eq)) equipmentRepository.save(eq);
        }
        for(Picture picture: apartment.getPictures()){
            if(!oldApartment.getPictures().contains(picture)) pictureRepository.save(picture);
        }
        for(ApartmentProperty property: apartment.getProperties()){
            if(!oldApartment.getProperties().contains(property)) apartmentPropertyRepository.save(property);
        }
        return apartmentRepository.save(apartment);
    }

    public Optional<Apartment> getApartmentById(long id){
        return apartmentRepository.findById(id);
    }

    public ApartmentDTO getApartmentDTO(long id){
        return getApartmentById(id)
                .map(ApartmentDTO::convertFromApartment)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Apartment with id = %d was not found", id)));
    }

    public List<ApartmentDTO> getAllApartments(){
        return apartmentRepository.findAll()
                .stream()
                .map(ApartmentDTO::convertFromApartment)
                .collect(Collectors.toList());
    }

    public List<Apartment> getApartmentsForUser(User user){
        return apartmentRepository.getApartmentsByOwner(user);
    }

    public Optional<User> getOptionalTenantForApartment(Apartment apartment) {
        return agreementService.getAgreementsForApartment(apartment)
                .stream()
                .filter(a -> a.getAgreementStatus() == AgreementStatus.active)
                .map(Agreement::getTenant)
                .findFirst();
    }

    public Apartment getApartmentFromUsernameAndId(String username, Long aid) {
        User owner = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with id %d was not found", aid)));
        Apartment apartment = getApartmentById(aid).orElseThrow(() -> new EntityNotFoundException(String.format("Apartment with id %d was not found", aid)));

        if (apartment.getOwner() != owner) {
            throw new IllegalStateException();
        }
        return apartment;
    }

    public Apartment createApartment(String username, ApartmentDTO apartmentDTO) {
        User owner = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException("User was not found"));
        LocalDate creationDate = LocalDate.now();
        Apartment apartment = Apartment.builder()
                .owner(owner)
                .address(apartmentDTO.getAddress())
                .description(apartmentDTO.getDescription())
                .latitude(apartmentDTO.getLatitude())
                .longitude(apartmentDTO.getLongitude())
                .name(apartmentDTO.getName())
                .creationDate(creationDate)
                .postalCode(apartmentDTO.getPostalCode())
                .size(apartmentDTO.getSize())
                .city(apartmentDTO.getCity())
                .properties(apartmentDTO.getProperties().stream().map(dto -> ApartmentProperty.builder()
                        .name(dto.getName())
                        .value(dto.getValue())
                        .valueType(dto.getValueType())
                        .build()
                ).collect(Collectors.toSet()))
                .notifications(new HashSet<>())
                .equipment(apartmentDTO.getEquipment().stream().map(dto -> Equipment.builder()
                        .isBroken(dto.getIsBroken())
                        .name(dto.getName())
                        .description(dto.getDescription())
                        .build()
                ).collect(Collectors.toSet()))
                .pictures(apartmentDTO.getPictures().stream().map(dto -> Picture.builder()
                        .name(dto.getName())
                        .imageData(Base64.getDecoder().decode(dto.getImageData().substring(dto.getImageData().indexOf(",") + 1)))
                        .build()
                ).collect(Collectors.toSet()))
                .build();
        return createApartment(apartment);
    }
}
