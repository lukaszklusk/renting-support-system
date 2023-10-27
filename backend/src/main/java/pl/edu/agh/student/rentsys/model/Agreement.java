package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("type2")
public class Agreement extends NotificationRelatedBaseEntity {
    private String name;
    private double monthlyPayment;
    private double administrationFee;
    private Apartment apartment;
    private User owner;
    private LocalDate signingDate;
    private LocalDate expirationDate;
    private User tenant;
    private String ownerAccountNo;
    private AgreementStatus agreementStatus;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getMonthlyPayment() {
        return monthlyPayment;
    }

    public void setMonthlyPayment(double monthlyPayment) {
        this.monthlyPayment = monthlyPayment;
    }

    @ManyToOne
    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    @ManyToOne
    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public LocalDate getSigningDate() {
        return signingDate;
    }

    public void setSigningDate(LocalDate signingDate) {
        this.signingDate = signingDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    @ManyToOne
    public User getTenant() {
        return tenant;
    }

    public void setTenant(User tenant) {
        this.tenant = tenant;
    }

    public double getAdministrationFee() {
        return administrationFee;
    }

    public void setAdministrationFee(double administrationFee) {
        this.administrationFee = administrationFee;
    }

    public String getOwnerAccountNo() {
        return ownerAccountNo;
    }

    public void setOwnerAccountNo(String ownerAccountNo) {
        this.ownerAccountNo = ownerAccountNo;
    }

    public AgreementStatus getAgreementStatus() {
        return agreementStatus;
    }

    public void setAgreementStatus(AgreementStatus agreementStatus) {
        this.agreementStatus = agreementStatus;
    }
}
