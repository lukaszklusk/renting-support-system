package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Builder
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "UK_APARTMENT_APARTMENT_PROPERTY",
                        columnNames = {"apartment_id", "name"}
                )
        }
)
public class ApartmentProperty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    private String name;
    private String valueType;
    private String value;
}
