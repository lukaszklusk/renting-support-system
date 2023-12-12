package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class ApartmentDTO {
    private Long id;
    private UserDTO owner;
    private UserDTO tenant;
    private String name;
    private String address;
    private String city;
    private String postalCode;
    private double latitude;
    private double longitude;
    private double size;
    private String description;
    private Set<ApartmentPropertyDTO> properties;
    private Set<PictureDTO> pictures;
    private Set<Notification> notifications;
    private Set<EquipmentDTO> equipment;


    public static ApartmentDTO convertFromApartment(Apartment apartment) {
        return ApartmentDTO.builder()
                .id(apartment.getId())
                .owner(UserDTO.convertFromUser(apartment.getOwner()))
                .tenant(Optional.ofNullable(apartment.getTenant()).map(UserDTO::convertFromUser).orElse(null))
                .name(apartment.getName())
                .address(apartment.getAddress())
                .city(apartment.getCity())
                .postalCode(apartment.getPostalCode())
                .latitude(apartment.getLatitude())
                .longitude(apartment.getLongitude())
                .size(apartment.getSize())
                .description(apartment.getDescription())
                .properties(apartment.getProperties().stream().map(ApartmentPropertyDTO::convertFromApartmentProperty).collect(Collectors.toSet()))
                .pictures(apartment.getPictures().stream().map(PictureDTO::convertFromPicture).collect(Collectors.toSet()))
                .notifications(apartment.getNotifications())
                .equipment(apartment.getEquipment().stream()
                                .map(EquipmentDTO::convertFromEquipment)
                                .collect(Collectors.toSet()))
                .build();
    }
}
