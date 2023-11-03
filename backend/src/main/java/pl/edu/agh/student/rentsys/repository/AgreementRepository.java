package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Agreement;
import pl.edu.agh.student.rentsys.model.AgreementStatus;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.User;

import java.util.List;

public interface AgreementRepository extends JpaRepository<Agreement, Long> {
    List<Agreement> getAgreementsByOwner(User owner);
    List<Agreement> findAllByOwnerAndAgreementStatus(User owner, AgreementStatus agreementStatus);
    List<Agreement> findAllByApartment(Apartment apartment);
    List<Agreement> findAllByTenant(User client);
    List<Agreement> findAllByTenantAndAgreementStatus(User tenant, AgreementStatus agreementStatus);
}
