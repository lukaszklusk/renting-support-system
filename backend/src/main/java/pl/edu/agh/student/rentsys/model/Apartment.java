package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
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
public class Apartment implements Notifiable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    @OneToOne
    private User tenant;
    private String name;
    private LocalDate creationDate;
    private String address;
    private String city;
    private String postalCode;
    private double latitude;
    private double longitude;
    private double size;
    private String description;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Equipment> equipment;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Set<Agreement> agreements;

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ApartmentProperty> properties;

    @OneToMany
    private Set<Picture> pictures;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Notification> notifications;

    @Override
    public void addNotification(Notification notification) {
        if (notifications == null) {
            notifications = new HashSet<>();
        }
        notifications.add(notification);
    }

}
