package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Payment {
    private Long id;
    private double amount;
    private PaymentStatus status;
    private Agreement agreement;
    private LocalDate dueDate;

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    @Enumerated(EnumType.STRING)
    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    @ManyToOne
    public Agreement getAgreement() {
        return agreement;
    }

    public void setAgreement(Agreement agreement) {
        this.agreement = agreement;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
