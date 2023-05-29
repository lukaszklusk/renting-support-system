package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
