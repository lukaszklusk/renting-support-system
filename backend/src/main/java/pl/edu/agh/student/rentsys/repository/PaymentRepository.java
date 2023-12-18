package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Agreement;
import pl.edu.agh.student.rentsys.model.Payment;
import pl.edu.agh.student.rentsys.model.PaymentStatus;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> getPaymentsByAgreement(Agreement agreement);

    List<Payment> getPaymentsByStatusIn(PaymentStatus[] statuses);
}
