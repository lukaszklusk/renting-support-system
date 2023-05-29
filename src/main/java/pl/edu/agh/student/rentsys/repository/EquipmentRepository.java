package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
