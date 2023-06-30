package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.ApartmentProperty;

public interface ApartmentPropertyRepository extends JpaRepository<ApartmentProperty, Long> {
}
