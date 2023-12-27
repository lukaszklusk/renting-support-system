package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
public class PaymentDTO {
    private Long id;
    private double amount;
    private String status;
    private Long agreementId;
    private Long apartmentId;
    private String paymentMethod;
    private Long startDate;
    private Long endDate;
    private Long dueDate;
    private Long paidDate;

    public static PaymentDTO convertFromPayment(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .agreementId(payment.getAgreement().getId())
                .apartmentId(payment.getAgreement().getApartment().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus().toString())
                .startDate(payment.getStartDate().toEpochDay())
                .endDate(payment.getEndDate().toEpochDay())
                .dueDate(payment.getDueDate().toEpochDay())
                .paymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod().toString() : null)
                .paidDate(payment.getPaidDate() != null ? payment.getPaidDate().toEpochDay() : null)
                .build();
    }
}
