package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Agreement;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.user.User;

import java.util.List;
import java.util.Set;

public interface AgreementRepository extends JpaRepository<Agreement, Long> {
    List<Agreement> getAgreementsByOwner(User owner);
    List<Agreement> findAllByApartment(Apartment apartment);
    List<Agreement> findAllByTenant(User client);
}
