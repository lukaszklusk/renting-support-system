package pl.edu.agh.student.rentsys.service;

import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.repository.ApartmentPropertyRepository;
import pl.edu.agh.student.rentsys.repository.ApartmentRepository;
import pl.edu.agh.student.rentsys.repository.EquipmentRepository;
import pl.edu.agh.student.rentsys.repository.PictureRepository;
import pl.edu.agh.student.rentsys.user.User;

import java.util.List;
import java.util.Optional;

@Service
public class ApartmentService {

    private ApartmentRepository apartmentRepository;
    private ApartmentPropertyRepository apartmentPropertyRepository;
    private PictureRepository pictureRepository;
    private EquipmentRepository equipmentRepository;

    public ApartmentService(ApartmentRepository apartmentRepository,
                            ApartmentPropertyRepository apartmentPropertyRepository,
                            PictureRepository pictureRepository,
                            EquipmentRepository equipmentRepository) {
        this.apartmentRepository = apartmentRepository;
        this.apartmentPropertyRepository = apartmentPropertyRepository;
        this.pictureRepository = pictureRepository;
        this.equipmentRepository = equipmentRepository;
    }

    public Apartment createApartment(Apartment apartment){
        equipmentRepository.saveAll(apartment.getEquipment());
        pictureRepository.saveAll(apartment.getPictures());
        apartmentPropertyRepository.saveAll(apartment.getProperties());
        return apartmentRepository.save(apartment);
    }

    public Apartment changeApartment(Apartment apartment){
        Optional<Apartment> oldApartmentOpt = apartmentRepository.findById(apartment.getId());
        if(oldApartmentOpt.isEmpty()) return null;
        Apartment oldApartment = oldApartmentOpt.get();
        for(Equipment eq: apartment.getEquipment()){
            if(!oldApartment.getEquipment().contains(eq)) equipmentRepository.save(eq);
        }
        for(Picture picture: apartment.getPictures()){
            if(!oldApartment.getPictures().contains(picture)) pictureRepository.save(picture);
        }
        for(ApartmentProperty property: apartment.getProperties()){
            if(!oldApartment.getProperties().contains(property)) apartmentPropertyRepository.save(property);
        }
        return apartmentRepository.save(apartment);
    }

    public Optional<Apartment> getApartment(long id){
        return apartmentRepository.findById(id);
    }

    public List<Apartment> getAllApartments(){
        return apartmentRepository.findAll();
    }

    public List<Apartment> getApartmentsForUser(User user){
        return apartmentRepository.getApartmentsByOwner(user);
    }
}
