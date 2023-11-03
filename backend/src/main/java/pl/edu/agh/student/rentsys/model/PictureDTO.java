package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.ZoneOffset;
import java.util.Base64;

@Data
@Builder
public class PictureDTO {
    private Long id;
    private String name;
    private String imageData;

    public static PictureDTO convertFromPicture(Picture picture) {
        return PictureDTO.builder()
                .id(picture.getId())
                .name(picture.getName())
                .imageData(Base64.getEncoder().encodeToString(picture.getImageData()))
                .build();
    }
}
