package pl.edu.agh.student.rentsys.scheduler;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import pl.edu.agh.student.rentsys.model.NotificationPriority;
import pl.edu.agh.student.rentsys.model.NotificationType;
import pl.edu.agh.student.rentsys.model.Payment;
import pl.edu.agh.student.rentsys.model.PaymentStatus;
import pl.edu.agh.student.rentsys.service.NotificationService;
import pl.edu.agh.student.rentsys.service.PaymentService;

import java.time.LocalDate;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Configuration
@EnableScheduling
public class SchedulerConfig {

    private final PaymentService paymentService;

    private final NotificationService notificationService;

    public SchedulerConfig(PaymentService paymentService, NotificationService notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 3 * * *")
    //@Scheduled(cron = "*/10 * * * * *")
    public void schedulerUpdatePaymentStatus(){
        List<Payment> payments = paymentService.getPaymentsByStatus(
                new PaymentStatus[]{PaymentStatus.future, PaymentStatus.due});
        for(Payment p: payments){
            if(p.getStatus().equals(PaymentStatus.due)){
                if(p.getDueDate().isBefore(LocalDate.now())) {
                    p.setStatus(PaymentStatus.overdue);
                    String[] dates = {p.getStartDate().toString(),  p.getEndDate().toString(), p.getDueDate().toString()};
                    String datesStr = String.join(" ", dates);

                    notificationService.createAndSendNotification(
                            p.getAgreement().getTenant(), p.getAgreement().getOwner(), NotificationType.payment_overdue, NotificationPriority.important, p.getName(), datesStr);
                }
            }
            if(p.getStatus().equals(PaymentStatus.future) && p.getStartDate().isBefore(LocalDate.now())){
                p.setStatus(PaymentStatus.due);
                String[] dates = {p.getStartDate().toString(),  p.getEndDate().toString(), p.getDueDate().toString()};
                String datesStr = String.join(" ", dates);

                notificationService.createAndSendNotification(
                        p.getAgreement().getTenant(), null, NotificationType.payment_due, NotificationPriority.important, p.getName(), datesStr);
            }
        }
        paymentService.updatePayments(payments);
    }
}
