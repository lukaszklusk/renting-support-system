package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Agreement;
import pl.edu.agh.student.rentsys.model.Payment;
import pl.edu.agh.student.rentsys.model.PaymentStatus;
import pl.edu.agh.student.rentsys.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(Payment payment){
        return paymentRepository.save(payment);
    }

    public Payment setPaymentStatus(Payment payment, PaymentStatus paymentStatus){
        payment.setStatus(paymentStatus);
        return paymentRepository.save(payment);
    }

    public Payment changePaymentAmount(Payment payment, double amount){
        payment.setAmount(amount);
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPayment(long id){
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsForAgreement(Agreement agreement){
        return paymentRepository.getPaymentsByAgreement(agreement);
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus[] statuses){
        return paymentRepository.getPaymentsByStatusIn(statuses);
    }

    public List<Payment> updatePayments(List<Payment> payments){
        return paymentRepository.saveAllAndFlush(payments);
    }

}
