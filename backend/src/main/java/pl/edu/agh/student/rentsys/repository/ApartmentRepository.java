package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.Equipment;
import pl.edu.agh.student.rentsys.model.User;


import java.util.List;
import java.util.Optional;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Apartment> getApartmentsByOwner(User owner);

    Optional<Apartment> getApartmentByOwnerAndName(User owner, String name);
}
