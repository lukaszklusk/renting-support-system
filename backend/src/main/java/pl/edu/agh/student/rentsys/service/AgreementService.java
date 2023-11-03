package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.AgreementChangeRepository;
import pl.edu.agh.student.rentsys.repository.AgreementRepository;
import pl.edu.agh.student.rentsys.model.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AgreementService {

    private AgreementRepository agreementRepository;
    private AgreementChangeRepository agreementChangeRepository;

    public AgreementService(AgreementRepository agreementRepository,
                            AgreementChangeRepository agreementChangeRepository) {
        this.agreementRepository = agreementRepository;
        this.agreementChangeRepository = agreementChangeRepository;
    }

    public Agreement createAgreement(Agreement agreement){
        agreement.setAgreementStatus(AgreementStatus.proposed);
        return agreementRepository.save(agreement);
    }

    public Agreement createDemoAgreement(Agreement agreement){
        return agreementRepository.save(agreement);
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
        agreement.setAgreementStatus(agreementStatus);
        return agreementRepository.save(agreement);
    }
}
