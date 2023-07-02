package pl.edu.agh.student.rentsys.tests;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;


@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ApartmentService apartmentService;
    private final PasswordEncoder passwordEncoder;
    private final AgreementService agreementService;

    @SneakyThrows
    @Override
    public void run(String... args) {
        // Create three example users
        User client = createUser("client@mail.com", "client", "client", UserRole.CLIENT);
        User client2 = createUser("client2@mail.com", "client2", "client2", UserRole.CLIENT);
        User owner = createUser("owner@mail.com", "owner", "owner", UserRole.OWNER);
        createUser("admin@mail.com", "admin", "admin", UserRole.ADMIN);
        Apartment apartment = createRandApartment("Apartment 1", "ul. Abc 15",
                50.017741,19.953718,owner);
        createRandApartment("Apartment 2", "ul. Dde 49",
                50.077285,19.872920,owner);
        Set<User> tenants = new HashSet<>();
        tenants.add(client);
        tenants.add(client2);
        createAgreement("Agreement 1", apartment, owner,
                LocalDate.of(2023,3, 13),
                LocalDate.of(2026, 3,1),
                tenants);
        System.out.println("----- FINISHED DATA INITIALIZATION -----");
    }

    private User createUser(String email, String username, String password, UserRole role) {
        User user = User.builder()
                .email(email)
                .username(username)
                .userRole(role)
                .password(passwordEncoder.encode(password))
                .locked(false)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    private Apartment createRandApartment(String name, String address,
                                     double latitude, double longitude,
                                     User owner) throws IOException {
        Apartment apartment = new Apartment();
        Set<ApartmentProperty> properties = new HashSet<>();
        int randomNum = ThreadLocalRandom.current().nextInt(30, 60 + 1);
        properties.add(new ApartmentProperty("Size", "number",
                Integer.toString(randomNum)));
        randomNum = ThreadLocalRandom.current().nextInt(100000, 1000000 + 1);
        properties.add(new ApartmentProperty("Price", "pln",
                Integer.toString(randomNum)));
        apartment.setProperties(properties);
        Set<Picture> pictures = new HashSet<>();
        byte[] testImg1 = this.getClass().getResourceAsStream("/img1.png").readAllBytes();
        byte[] testImg2 = this.getClass().getResourceAsStream("/img2.png").readAllBytes();
        pictures.add(new Picture("Picture 1", testImg1));
        pictures.add(new Picture("Picture 2", testImg2));
        apartment.setPictures(pictures);
        Set<Equipment> equipment = new HashSet<>();
        equipment.add(new Equipment("Fridge", "SAMSUNG RB38T774DB1 EF No frost 203cm"));
        equipment.add(new Equipment("Chair", "Wooden chair"));
        apartment.setEquipment(equipment);
        apartment.setName(name);
        apartment.setAddress(address);
        apartment.setLatitude(latitude);
        apartment.setLongitude(longitude);
        apartment.setOwner(owner);
        return apartmentService.createApartment(apartment);
    }

    public Agreement createAgreement(String name, Apartment apartment, User owner,
                                     LocalDate signDate, LocalDate expiryDate,
                                     Set<User> tenant){
        Agreement agreement = new Agreement();
        agreement.setName(name);
        int randomNum = ThreadLocalRandom.current().nextInt(100000, 400000 + 1);
        agreement.setMonthlyPayment(randomNum/100.);
        agreement.setOwner(owner);
        agreement.setApartment(apartment);
        agreement.setTenants(tenant);
        agreement.setSigningDate(signDate);
        agreement.setExpirationDate(expiryDate);
        return agreementService.createAgreement(agreement);
    }
}

