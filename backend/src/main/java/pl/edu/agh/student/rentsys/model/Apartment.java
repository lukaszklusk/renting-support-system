package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import pl.edu.agh.student.rentsys.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Apartment {
    private Long id;
    private User owner;
    private String name;
    private String address;
    private double coordinatesX;
    private double coordinatesY;
    private Set<Equipment> equipment;
    private Set<ApartmentProperty> properties;
    private Set<Picture> pictures;

    @OneToMany
    public Set<Picture> getPictures() {
        return pictures;
    }

    public void setPictures(Set<Picture> pictures) {
        this.pictures = new HashSet<>(pictures);
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    @OneToOne
    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getCoordinatesX() {
        return coordinatesX;
    }

    public void setCoordinatesX(double coordinatesX) {
        this.coordinatesX = coordinatesX;
    }

    public double getCoordinatesY() {
        return coordinatesY;
    }

    public void setCoordinatesY(double coordinatesY) {
        this.coordinatesY = coordinatesY;
    }

    @OneToMany
    public Set<Equipment> getEquipment() {
        return equipment;
    }

    public void setEquipment(Set<Equipment> equipment) {
        this.equipment = new HashSet<>(equipment);
    }

    @OneToMany
    public Set<ApartmentProperty> getProperties() {
        return properties;
    }

    public void setProperties(Set<ApartmentProperty> properties) {
        this.properties = new HashSet<>(properties);
    }
}
