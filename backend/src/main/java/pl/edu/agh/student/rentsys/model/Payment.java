package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.lang.Nullable;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment implements Notifiable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @ManyToOne
    private Agreement agreement;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private LocalDate dueDate;
    private LocalDate paidDate;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<Notification> notifications;

    @Override
    public void addNotification(Notification notification) {
        if (notifications == null) {
            notifications = new HashSet<>();
        }
        notifications.add(notification);
    }

    @Override
    public String getName() {
        return getAgreement().getApartment().getName();
    }
}
