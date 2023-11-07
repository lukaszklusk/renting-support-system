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
        pictureRepository.saveAll(apartment.getPictures());
        apartmentPropertyRepository.saveAll(apartment.getProperties());

        Notification notification = notificationService.createAndSendNotification(apartment.getOwner(), null, NotificationType.apartment_created, NotificationPriority.critical, apartment.getName());
        apartment.addNotification(notification);

        Apartment createdApartment = apartmentRepository.save(apartment);
        for (Equipment equipment: createdApartment.getEquipment()) {
            equipment.setApartment(apartment);
        }
        equipmentRepository.saveAll(apartment.getEquipment());
        return createdApartment;
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

    public Optional<ApartmentDTO> getApartmentDTO(long id){
        return getApartmentById(id).map(ApartmentDTO::convertFromApartment);
    }

    public List<Apartment> getAllApartments(){
        return apartmentRepository.findAll();
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
        Apartment apartment = Apartment.builder()
                .owner(owner)
                .address(apartmentDTO.getAddress())
                .description(apartmentDTO.getDescription())
                .latitude(apartmentDTO.getLatitude())
                .longitude(apartmentDTO.getLongitude())
                .name(apartmentDTO.getName())
                .postalCode(apartmentDTO.getPostalCode())
                .size(apartmentDTO.getSize())
                .city(apartmentDTO.getCity())
                .properties(apartmentDTO.getProperties())
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
