package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;

@Entity
public class Picture {
    private Long id;
    private String name;
    private byte[] image;

    public void setId(Long id) {
        this.id = id;
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
}
