package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;

import java.util.Objects;
import java.util.Set;

@Entity
public class Equipment {
    private Long id;
    private String name;
    private String description;
    private Set<Message> issues;
    public void setId(Long id) {
        this.id = id;
    }

    public Equipment() {
    }

    public Equipment(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Equipment(long id){
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @OneToMany
    public Set<Message> getIssues() {
        return issues;
    }

    public void setIssues(Set<Message> issues) {
        this.issues = issues;
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
