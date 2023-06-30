package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.user.User;


import java.util.List;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Apartment> getApartmentsByOwner(User owner);
}
