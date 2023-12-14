package pl.edu.agh.student.rentsys.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.AgreementChangeRepository;
import pl.edu.agh.student.rentsys.repository.AgreementRepository;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.repository.ApartmentRepository;
import pl.edu.agh.student.rentsys.repository.PaymentRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@AllArgsConstructor
public class AgreementService {

    @Autowired
    private final AgreementRepository agreementRepository;
    @Autowired
    private final AgreementChangeRepository agreementChangeRepository;
    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private final UserService userService;
    @Autowired
    private final ApartmentRepository apartmentRepository;
    @Autowired
    private final PaymentService paymentService;

    public Agreement createDemoAgreement(Agreement agreement){
        Agreement savedAgreement = agreementRepository.save(agreement);;
        List<Payment> generatedPayments = generatePaymentsForAgreement(agreement);
        paymentService.updatePayments(generatedPayments);
        return savedAgreement;
    }

    public Agreement changeAgreement(Agreement agreement){
        Optional<Agreement> oldAgreementOpt = agreementRepository.findById(agreement.getId());
        if(oldAgreementOpt.isEmpty()) return null;
        Agreement oldAgreement = oldAgreementOpt.get();
        if(!oldAgreement.getExpirationDate().equals(agreement.getExpirationDate())){
            AgreementChange agreementChange = new AgreementChange(agreement, LocalDate.now(),
                    "ExpirationDate", oldAgreement.getExpirationDate().toString(),
                    agreement.getExpirationDate().toString());
            agreementChangeRepository.save(agreementChange);
        }
        if(!oldAgreement.getName().equals(agreement.getName())){
            AgreementChange agreementChange = new AgreementChange(agreement, LocalDate.now(),
                    "AgreementName", oldAgreement.getName(),
                    agreement.getName());
            agreementChangeRepository.save(agreementChange);
        }
        if(!oldAgreement.getSigningDate().equals(agreement.getSigningDate())){
            AgreementChange agreementChange = new AgreementChange(agreement, LocalDate.now(),
                    "SigningDate", oldAgreement.getSigningDate().toString(),
                    agreement.getSigningDate().toString());
            agreementChangeRepository.save(agreementChange);
        }
        if(!oldAgreement.getOwner().equals(agreement.getOwner())){
            AgreementChange agreementChange = new AgreementChange(agreement, LocalDate.now(),
                    "Owner", oldAgreement.getOwner().getUsername(),
                    agreement.getOwner().getUsername());
            agreementChangeRepository.save(agreementChange);
        }
        if(oldAgreement.getMonthlyPayment() != agreement.getMonthlyPayment()){
            AgreementChange agreementChange = new AgreementChange(agreement, LocalDate.now(),
                    "MonthlyPayment", Double.toString(oldAgreement.getMonthlyPayment()),
                    Double.toString(agreement.getMonthlyPayment()));
            agreementChangeRepository.save(agreementChange);
        }
        agreementRepository.save(agreement);
        return agreement;
    }

    public List<Agreement> getAllAgreements(){
        return agreementRepository.findAll();
    }

    public Optional<Agreement> getAgreementById(long id){
        return agreementRepository.findById(id);
    }

    public Optional<AgreementDTO> getAgreementDTOById(long id){
        return getAgreementById(id).map(AgreementDTO::convertFromAgreement);
    }

    public List<Agreement> getAgreementsForOwner(User user){
        return agreementRepository.getAgreementsByOwner(user);
    }

    public List<Agreement> getAgreementsForOwnerWithStatus(User owner, AgreementStatus status){
        return agreementRepository.findAllByOwnerAndAgreementStatus(owner,status);
    }

    public List<AgreementChange> getAgreementChangesForAgreement(Agreement agreement){
        return agreementChangeRepository.getAgreementChangesByAgreement(agreement);
    }

    public List<Agreement> getAgreementsForApartment(Apartment apartment){
        return agreementRepository.findAllByApartment(apartment);
    }

    public List<Agreement> getAgreementsForClientWithStatus(User client, AgreementStatus status){
        return agreementRepository.findAllByTenantAndAgreementStatus(client,status);
    }

    public List<Agreement> getAgreementsForClient(User client){
        return agreementRepository.findAllByTenant(client);
    }

    public Agreement changeAgreementStatus(String username, long aid, boolean status, boolean isOwner) {

        User owner, client;
        Agreement agreement;

        if (isOwner) {
            owner = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username %s was not found", username)));
            agreement =  getAgreementById(aid).orElseThrow(() -> new EntityNotFoundException(String.format("Agreement with id %d was not found", aid)));
            client = agreement.getTenant();
        } else {
            client = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException(String.format("User with username %s was not found", username)));
            agreement =  getAgreementById(aid).orElseThrow(() -> new EntityNotFoundException(String.format("Agreement with id %d was not found", aid)));
            owner = agreement.getOwner();
        }

        if (!owner.equals(agreement.getOwner()) || !client.equals(agreement.getTenant())) {
            throw new IllegalStateException();
        }

        return status ? acceptAgreement(agreement, isOwner, false) : rejectAgreement(agreement, isOwner);

    }

    private Agreement rejectAgreement(Agreement agreement, boolean isOwner) {
        AgreementStatus newAgreementStatus = agreement.getAgreementStatus().reject(isOwner)
                .orElseThrow(IllegalStateException::new);
        return changeAgreementStatus(agreement, newAgreementStatus, isOwner);
    }

    private Agreement acceptAgreement(Agreement agreement, boolean isOwner, boolean callByActivate) {
        AgreementStatus newAgreementStatus = agreement.getAgreementStatus().accept(isOwner)
                .orElseThrow(IllegalStateException::new);
        if (newAgreementStatus.equals(AgreementStatus.active) && !callByActivate) {
            return activateAgreement(agreement);
        }
        return changeAgreementStatus(agreement, newAgreementStatus, isOwner);
    }

    private Agreement changeAgreementStatus(Agreement agreement, AgreementStatus newAgreementStatus, boolean isOwner) {
        agreement.setAgreementStatus(newAgreementStatus);
        NotificationType notificationType = newAgreementStatus.mapToNotificationType();


        User sender = isOwner ? agreement.getOwner() : agreement.getTenant();
        User receiver = isOwner ? agreement.getTenant() : agreement.getOwner();

        Notification notification = notificationService.createAndSendNotification(
                sender, receiver,
                notificationType,
                NotificationPriority.critical,
                agreement.getName(),
                agreement.getApartment().getName()
        );
        agreement.addNotification(notification);
        return agreementRepository.save(agreement);
    }
    public Agreement activateAgreement(Agreement agreementToActivate) {
        List<Payment> generatedPayments = generatePaymentsForAgreement(activatedAgreement);
        paymentService.updatePayments(generatedPayments);

        List<Agreement> clientAgreements = getAgreementsForClient(agreementToActivate.getTenant());
        List<Agreement> apartmentAgreements = agreementRepository.findAllByApartment(agreementToActivate.getApartment());

        List<Agreement> rejectedAgreements = Stream.concat(clientAgreements.stream(), apartmentAgreements.stream())
                .filter(agreement -> !Objects.equals(agreement.getId(), agreementToActivate.getId()))
                .filter(agreement -> agreement.getAgreementStatus().isAlive())
                .distinct()
                .toList();

        for (var rejectedAgreement: rejectedAgreements) {
            boolean isOwner = rejectedAgreement.getOwner().equals(agreementToActivate.getOwner());
            rejectAgreement(rejectedAgreement, isOwner);
        }

        Agreement activeAgreement = acceptAgreement(agreementToActivate, true, true);
        Apartment apartment = activeAgreement.getApartment();
        apartment.setTenant(activeAgreement.getTenant());
        apartmentRepository.save(apartment);

        return agreementRepository.save(activeAgreement);
    }

    public Agreement createAgreement(String username, AgreementDTO agreementDTO){
        User owner = userService.getUserByUsername(username).orElseThrow(() -> new EntityNotFoundException("Owner was not found"));
        User tenant = userService.getUserByUsername(agreementDTO.getTenant().getUsername()).orElseThrow(
                () -> new EntityNotFoundException("Tenant was not found")
        );
        Apartment apartment = apartmentRepository.getApartmentByOwnerAndName(owner, agreementDTO.getApartmentName()).orElseThrow(() -> new EntityNotFoundException("Apartment was not found"));

        Agreement agreement = Agreement.builder()
                .owner(owner)
                .tenant(tenant)
                .name(agreementDTO.getName())
                .apartment(apartment)
                .monthlyPayment(agreementDTO.getMonthlyPayment())
                .administrationFee(agreementDTO.getAdministrationFee())
                .ownerAccountNo(agreementDTO.getOwnerAccountNo())
                .agreementStatus(AgreementStatus.proposed)
                .signingDate(LocalDate.ofEpochDay(agreementDTO.getSigningDate()))
                .expirationDate(LocalDate.ofEpochDay(agreementDTO.getExpirationDate()))
                .build();

        Notification notification = notificationService.createAndSendNotification(owner, tenant, NotificationType.agreement_proposed, NotificationPriority.critical, agreement.getName(), agreement.getApartment().getName());
        agreement.addNotification(notification);
        return agreementRepository.save(agreement);
    }

    private List<Payment> generatePaymentsForAgreement(Agreement agreement){
        ArrayList<Payment> payments = new ArrayList<>();
        LocalDate paymentDate = agreement.getSigningDate().plusMonths(1);
        while(paymentDate.isBefore(agreement.getExpirationDate())){
            Payment payment = null;
            if(DAYS.between(LocalDate.now(),paymentDate) <= 30) {
                payment = Payment.builder()
                        .dueDate(paymentDate)
                        .status(PaymentStatus.due)
                        .agreement(agreement)
                        .amount(agreement.getMonthlyPayment())
                        .build();
            }else{
                payment = Payment.builder()
                        .dueDate(paymentDate)
                        .status(PaymentStatus.future)
                        .agreement(agreement)
                        .amount(agreement.getMonthlyPayment())
                        .build();
            }
            payments.add(payment);
            paymentDate = paymentDate.plusMonths(1);
        }
        return payments;
    }
}
