package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApartmentPropertyDTO {
    private Long id;
    private Long apartmentId;
    private String name;
    private String valueType;
    private String value;

    public static ApartmentPropertyDTO convertFromApartmentProperty(ApartmentProperty property) {
        return ApartmentPropertyDTO.builder()
                .id(property.getId())
                .name(property.getName())
                .valueType(property.getValueType())
                .value(property.getValue())
                .apartmentId(property.getApartment().getId())
                .build();
    }
}
