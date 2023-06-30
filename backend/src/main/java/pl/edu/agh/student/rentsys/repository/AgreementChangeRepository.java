package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Agreement;
import pl.edu.agh.student.rentsys.model.AgreementChange;

import java.util.List;

public interface AgreementChangeRepository extends JpaRepository<AgreementChange, Long> {

    List<AgreementChange> getAgreementChangesByAgreement(Agreement agreement);
}
