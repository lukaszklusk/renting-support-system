package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = {
                @UniqueConstraint(name = "name_apartment_unique", columnNames = {"name", "apartment_id"})
        }
)
public class Agreement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double monthlyPayment;
    private double administrationFee;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne
    private User owner;
    private LocalDate signingDate;
    private LocalDate expirationDate;

    @ManyToOne
    private User tenant;
    private String ownerAccountNo;
    private AgreementStatus agreementStatus;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Notification> notifications;
}
