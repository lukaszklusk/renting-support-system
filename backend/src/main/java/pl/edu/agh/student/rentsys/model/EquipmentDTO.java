package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EquipmentDTO {
    protected Long id;
    private String name;
    private String description;
    private Boolean isBroken;
    private Long apartmentId;

    public static EquipmentDTO convertFromEquipment(Equipment equipment) {
        return EquipmentDTO.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .description(equipment.getDescription())
                .isBroken(equipment.getIsBroken())
                .apartmentId(equipment.getApartment().getId())
                .build();
    }
}
