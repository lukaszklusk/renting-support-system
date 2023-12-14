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

    public List<Agreement> getAgreementForUser(User user){
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

    public Agreement changeAgreementStatus(Agreement agreement, AgreementStatus agreementStatus){
        if (agreementStatus.equals(AgreementStatus.active)) {
            return activateAgreement(agreement);
        }

//        TODO:
        agreement.setAgreementStatus(agreementStatus);
        Notification notification = notificationService.createAndSendNotification (
                agreement,
                NotificationType.agreement_activated,
                agreement.getName()
        );
        agreement.addNotification(notification);
        return agreementRepository.save(agreement);
    }

    public Agreement activateAgreement(Agreement activatedAgreement) {
        List<Payment> generatedPayments = generatePaymentsForAgreement(activatedAgreement);
        paymentService.updatePayments(generatedPayments);

        List<Agreement> apartmentAgreements = agreementRepository.findAllByApartment(activatedAgreement.getApartment());

        List<Agreement> modifiedAgreements = apartmentAgreements.stream()
                .filter(agreement -> !Objects.equals(agreement.getId(), activatedAgreement.getId()))
                .filter(agreement -> agreement.getAgreementStatus() == AgreementStatus.proposed
                        || agreement.getAgreementStatus() == AgreementStatus.accepted)
                .toList();

        for (var modifiedAgreement: modifiedAgreements) {
            NotificationType notificationType = null;
            if (modifiedAgreement.getAgreementStatus() == AgreementStatus.proposed) {
                modifiedAgreement.setAgreementStatus(AgreementStatus.withdrawn);
                notificationType = NotificationType.agreement_withdrawn;
            } else {
                modifiedAgreement.setAgreementStatus(AgreementStatus.rejected_owner);
                notificationType = NotificationType.agreement_rejected_owner;
            }

            Notification notification = notificationService.createAndSendNotification (
                    modifiedAgreement,
                    notificationType,
                    activatedAgreement.getName()
            );
            modifiedAgreement.addNotification(notification);
            agreementRepository.save(modifiedAgreement);
        }

        activatedAgreement.setAgreementStatus(AgreementStatus.active);
        Notification notification = notificationService.createAndSendNotification (
                activatedAgreement,
                NotificationType.agreement_activated,
                activatedAgreement.getName()
        );
        activatedAgreement.addNotification(notification);
        return agreementRepository.save(activatedAgreement);
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

        Notification notification = notificationService.createAndSendNotification(agreement, NotificationType.agreement_proposed, agreement.getApartment().getName());
        agreement.addNotification(notification);
        return agreementRepository.save(agreement);
    }

    private List<Payment> generatePaymentsForAgreement(Agreement agreement){
        ArrayList<Payment> payments = new ArrayList<>();
        LocalDate paymentDate = agreement.getSigningDate().plusMonths(1);
        while(paymentDate.isBefore(agreement.getExpirationDate())){
            Payment payment = Payment.builder()
                    .dueDate(paymentDate)
                    .status(PaymentStatus.future)
                    .agreement(agreement)
                    .amount(agreement.getMonthlyPayment())
                    .build();
            payments.add(payment);
            paymentDate = paymentDate.plusMonths(1);
        }
        return payments;
    }
}
