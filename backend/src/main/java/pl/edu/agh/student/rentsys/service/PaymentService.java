package pl.edu.agh.student.rentsys.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.AgreementRepository;
import pl.edu.agh.student.rentsys.repository.PaymentRepository;
import pl.edu.agh.student.rentsys.security.UserRole;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@AllArgsConstructor
public class PaymentService {

    @Autowired
    private final PaymentRepository paymentRepository;
    @Autowired
    private final UserService userService;
    @Autowired
    private final NotificationService notificationService;

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
        return paymentRepository.saveAll(payments);
    }

    public List<PaymentDTO> getUserAllPayments(String username) {
        User user = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username %s was not found", username)));
        List<Payment> payments = paymentRepository.getPaymentByAgreement_OwnerOrAgreement_Tenant(user, user);
        return payments.stream().map(PaymentDTO::convertFromPayment).collect(Collectors.toList());
    }

    public List<Payment> generatePaymentsForAgreement(Agreement agreement){
        ArrayList<Payment> payments = new ArrayList<>();
        LocalDate startDate = agreement.getSigningDate();
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        LocalDate paymentDate = endDate.plusWeeks(1);
        while(startDate.isBefore(agreement.getExpirationDate())){
            Payment payment = null;
            if(startDate.isBefore(LocalDate.now())) {
                payment = Payment.builder()
                        .startDate(startDate)
                        .endDate(endDate)
                        .dueDate(paymentDate)
                        .status(PaymentStatus.due)
                        .agreement(agreement)
                        .amount(agreement.getMonthlyPayment())
                        .build();
            } else {
                payment = Payment.builder()
                        .startDate(startDate)
                        .endDate(endDate)
                        .dueDate(paymentDate)
                        .status(PaymentStatus.future)
                        .agreement(agreement)
                        .amount(agreement.getMonthlyPayment())
                        .build();
            }
            payments.add(payment);
            startDate = startDate.plusMonths(1);
            endDate = endDate.plusMonths(1);
            paymentDate = paymentDate.plusMonths(1);
        }
        return payments;
    }

    public Payment payPayment(String username, long pid, boolean byOwner) {
        Payment payment = getPayment(pid).orElseThrow(() -> new EntityNotFoundException(String.format("Payment with id %d was not found", pid)));
        Agreement agreement = payment.getAgreement();
        User owner = agreement.getOwner();
        User client = agreement.getTenant();
        User payingUser = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username %s was not found", username)));
        NotificationType notificationType;
        User sender, receiver;

        if (byOwner) {
            if (!owner.equals(payingUser)) {
                throw new IllegalStateException();
            }
            payment.setPaymentMethod(PaymentMethod.cash);
            notificationType = payment.getStatus().equals(PaymentStatus.overdue) ? NotificationType.payment_late_owner : NotificationType.payment_owner;
            sender = owner;
            receiver = client;
        } else {
            if (!client.equals(payingUser)) {
                throw new IllegalStateException();
            }
            payment.setPaymentMethod(PaymentMethod.card);
            notificationType = payment.getStatus().equals(PaymentStatus.overdue) ? NotificationType.payment_late_client : NotificationType.payment_client;
            sender = client;
            receiver = owner;
        }

        LocalDate paidDate = LocalDate.now();
        payment.setPaidDate(paidDate);
        payment.setStatus(payment.getStatus().equals(PaymentStatus.overdue) ? PaymentStatus.paid_late : PaymentStatus.paid);

        String[] dates = {payment.getStartDate().toString(),  payment.getEndDate().toString(), payment.getDueDate().toString()};
        String datesStr = String.join(" ", dates);

        Notification notification = notificationService.createAndSendNotification(sender, receiver, notificationType, NotificationPriority.important, payment.getName(), datesStr);
        payment.addNotification(notification);
        return paymentRepository.save(payment);
    }

    void cancelAgreementFuturePayments(Agreement agreement) {
        List<Payment> payments = paymentRepository.getPaymentsByAgreement(agreement);
        List<Payment> futurePayments = payments.stream()
                .filter(p -> p.getStatus().equals(PaymentStatus.future))
                .toList();

        for (var payment: futurePayments) {
            payment.setStatus(PaymentStatus.cancelled);
            paymentRepository.save(payment);
        }
    }
}
