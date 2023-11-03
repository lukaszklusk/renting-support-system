package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(
        uniqueConstraints = {
                @UniqueConstraint(name = "name_user_unique", columnNames = {"name", "owner_id"})
        }
)
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    private String name;
    private String address;
    private String city;
    private String postalCode;
    private double latitude;
    private double longitude;
    private double size;
    private String description;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL)
    private Set<Equipment> equipment;

    @OneToMany
    private Set<ApartmentProperty> properties;

    @OneToMany
    private Set<Picture> pictures;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Notification> notifications;

}
