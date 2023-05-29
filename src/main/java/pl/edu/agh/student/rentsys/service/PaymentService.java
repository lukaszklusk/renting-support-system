package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.Payment;
import pl.edu.agh.student.rentsys.model.PaymentStatus;
import pl.edu.agh.student.rentsys.repository.PaymentRepository;

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

}
