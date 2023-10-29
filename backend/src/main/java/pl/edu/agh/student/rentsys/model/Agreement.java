package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import pl.edu.agh.student.rentsys.user.User;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Agreement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    private String name;
    private double monthlyPayment;
    private double administrationFee;

    @ManyToOne
    private Apartment apartment;

    @ManyToOne
    private User owner;
    private LocalDate signingDate;
    private LocalDate expirationDate;

    @ManyToOne
    private User tenant;
    private String ownerAccountNo;
    private AgreementStatus agreementStatus;

}
