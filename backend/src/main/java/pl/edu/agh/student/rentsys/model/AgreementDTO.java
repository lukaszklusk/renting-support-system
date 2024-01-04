package pl.edu.agh.student.rentsys.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.ZoneId;

@Builder
@Data
public class AgreementDTO {
    private Long id;
    private Long apartmentId;
    private UserDTO owner;
    private UserDTO tenant;
    private String name;
    private String apartmentName;
    private double monthlyPayment;
    private double administrationFee;
    private Long signingDate;
    private Long expirationDate;
    private String ownerAccountNo;
    private String agreementStatus;

    public static AgreementDTO convertFromAgreement(Agreement agreement) {
        return AgreementDTO.builder()
                .id(agreement.getId())
                .apartmentId(agreement.getApartment().getId())
                .owner(UserDTO.convertFromUser(agreement.getOwner()))
                .tenant(UserDTO.convertFromUser(agreement.getTenant()))
                .name(agreement.getName())
                .apartmentName(agreement.getApartment().getName())
                .monthlyPayment(agreement.getMonthlyPayment())
                .administrationFee(agreement.getAdministrationFee())
                .expirationDate(agreement.getExpirationDate().toEpochDay())
                .signingDate(agreement.getSigningDate().toEpochDay())
                .ownerAccountNo(agreement.getOwnerAccountNo())
                .agreementStatus(agreement.getAgreementStatus().toString())
                .build();
    }

    @Override
    public String toString() {
        return "AgreementDTO{" +
                "id=" + id +
                ", apartmentId=" + apartmentId +
                ", owner=" + owner.getId() +
                ", tenant=" + tenant.getId() +
                ", name='" + name + '\'' +
                ", apartmentName='" + apartmentName + '\'' +
                ", monthlyPayment=" + monthlyPayment +
                ", administrationFee=" + administrationFee +
                ", signingDate=" + signingDate +
                ", expirationDate=" + expirationDate +
                ", ownerAccountNo='" + ownerAccountNo + '\'' +
                ", agreementStatus='" + agreementStatus + '\'' +
                '}';
    }
}
