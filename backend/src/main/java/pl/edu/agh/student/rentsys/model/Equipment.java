package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    private String name;
    private String description;

    @OneToMany
    private Set<Notification> issues;


    public Equipment(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Equipment equipment = (Equipment) o;
        if(equipment.getId() == null || this.getId()== null) return false;
        return getId().equals(equipment.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

}
