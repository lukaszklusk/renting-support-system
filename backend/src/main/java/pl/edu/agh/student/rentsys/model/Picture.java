package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Picture {
    private Long id;
    private String name;
    private byte[] image;

    public void setId(Long id) {
        this.id = id;
    }

    public Picture() {
    }

    public Picture(String name, byte[] image) {
        this.name = name;
        this.image = image;
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Lob
    @Column(length = 10485760)
    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Picture picture = (Picture) o;
        if(picture.getId() == null || this.getId()== null) return false;
        return getId().equals(picture.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
