package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.student.rentsys.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User owner;
    private String name;
    private String address;
    private String city;
    private String postalCode;
    private double latitude;
    private double longitude;
    private double size;
    private String description;

    @OneToMany
    private Set<Equipment> equipment;

    @OneToMany
    private Set<ApartmentProperty> properties;

    @OneToMany
    private Set<Picture> pictures;


    public void setPictures(Set<Picture> pictures) {
        this.pictures = new HashSet<>(pictures);
    }

    public void setEquipment(Set<Equipment> equipment) {
        this.equipment = new HashSet<>(equipment);
    }

    public void setProperties(Set<ApartmentProperty> properties) {
        this.properties = new HashSet<>(properties);
    }
}
