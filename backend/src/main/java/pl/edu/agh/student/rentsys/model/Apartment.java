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
    private String city;
    private String postalCode;
    private double latitude;
    private double longitude;
    private double size;
    private String description;
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

    @ManyToOne
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

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
