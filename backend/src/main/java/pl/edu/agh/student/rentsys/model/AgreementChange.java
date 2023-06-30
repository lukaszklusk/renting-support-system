package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;

@Entity
public class AgreementChange {
    private Long id;
    private Agreement agreement;
    private LocalDate changeDate;
    private String changedValue;
    private String oldValue;
    private String newValue;

    public AgreementChange() {
    }

    public AgreementChange(Agreement agreement, LocalDate changeDate,
                           String changedValue, String oldValue, String newValue) {
        this.agreement = agreement;
        this.changeDate = changeDate;
        this.changedValue = changedValue;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue
    public Long getId() {
        return id;
    }

    @OneToOne
    public Agreement getAgreement() {
        return agreement;
    }

    public void setAgreement(Agreement agreement) {
        this.agreement = agreement;
    }

    public LocalDate getChangeDate() {
        return changeDate;
    }

    public void setChangeDate(LocalDate changeDate) {
        this.changeDate = changeDate;
    }

    public String getChangedValue() {
        return changedValue;
    }

    public void setChangedValue(String changedValue) {
        this.changedValue = changedValue;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }
}
