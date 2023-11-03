package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

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
                        name = "UK_APARTMENT_EQUIPMENT",
                        columnNames = {"apartment_id", "name"}
                )
        }
)
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    private String name;
    private String description;
    private Boolean isBroken;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Notification> notifications;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;
}
