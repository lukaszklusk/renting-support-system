package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.AgreementChange;

public interface AgreementChangeRepository extends JpaRepository<AgreementChange, Long> {
}
