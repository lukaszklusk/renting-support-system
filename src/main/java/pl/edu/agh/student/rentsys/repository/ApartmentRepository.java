package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Apartment;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
}
