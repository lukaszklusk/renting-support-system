package pl.edu.agh.student.rentsys.tests;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.HashSet;
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
        User client = createUser("client@mail.com", "client", "client", UserRole.CLIENT,
                "Jan", "Kowalski", "+48465234098");
        User client2 = createUser("client2@mail.com", "client2", "client2", UserRole.CLIENT,
                "Ala", "Kowalska", "+48557832997");
        User client3 = createUser("client3@mail.com", "client3", "client3", UserRole.CLIENT,
                "Adam", "Nowak", "+48111222333");
        User owner = createUser("owner@mail.com", "owner", "owner", UserRole.OWNER,
                "Adam", "Mickiewicz", "+48774623921");
        createUser("admin@mail.com", "admin", "admin", UserRole.ADMIN,
                "Admin", "Admiński", "+48666420123");
        Apartment apartment = createRandApartment("Apartment 1", "ul. Abc 15",
                "Kraków", "30-349",
                50.017741,19.953718,owner);

        Apartment apartment2 = createRandApartment("Apartment 2", "ul. Dde 49",
                "Kraków", "30-349",
                50.077285,19.872920,owner);

        createAgreement("Agreement 1", apartment, owner,
                LocalDate.of(2023,3, 13),
                LocalDate.of(2026, 3,1),
                client, "PL84109024029425764271319137", AgreementStatus.active);

        createAgreement("Agreement 18", apartment, owner,
                LocalDate.of(2021,3, 13),
                LocalDate.of(2022, 3,1),
                client3, "PL84109024029425764271319137", AgreementStatus.cancelled);

        createAgreement("Agreement 18", apartment, owner,
                LocalDate.of(2019,3, 13),
                LocalDate.of(2020, 3,1),
                client2, "PL84109024029425764271319137", AgreementStatus.cancelled);

        createAgreement("Agreement 72", apartment2, owner,
                LocalDate.of(2023,7, 15),
                LocalDate.of(2024, 7,15),
                client3, "PL84109024029425764271319137", AgreementStatus.proposed);

        createAgreement("Agreement 75", apartment2, owner,
                LocalDate.of(2023,7, 15),
                LocalDate.of(2024, 7,15),
                client2, "PL84109024029425764271319137", AgreementStatus.proposed);
        System.out.println("----- FINISHED DATA INITIALIZATION -----");
    }

    private User createUser(String email, String username, String password, UserRole role,
                            String firstname, String lastname, String phoneNumber) {
        User user = User.builder()
                .email(email)
                .username(username)
                .userRole(role)
                .password(passwordEncoder.encode(password))
                .firstName(firstname)
                .lastName(lastname)
                .phoneNumber(phoneNumber)
                .locked(false)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    private Apartment createRandApartment(String name, String address,
                                     String city, String postalCode,
                                     double latitude, double longitude,
                                     User owner) throws IOException {
        Apartment apartment = new Apartment();
        Set<ApartmentProperty> properties = new HashSet<>();
        int randomNum = ThreadLocalRandom.current().nextInt(300, 600 + 1);
        apartment.setSize(randomNum/10.);
        apartment.setCity(city);
        apartment.setPostalCode(postalCode);
        randomNum = ThreadLocalRandom.current().nextInt(100000, 1000000 + 1);
        properties.add(new ApartmentProperty("Price", "pln",
                Integer.toString(randomNum)));
        apartment.setProperties(properties);
        Set<Picture> pictures = new HashSet<>();
        byte[] testImg = this.getClass().getResourceAsStream("/img1.png").readAllBytes();
        pictures.add(new Picture("Picture 1", "data:image/png;base64," + Base64.getMimeEncoder().encodeToString(testImg)));
        pictures.add(new Picture("Picture 2", "data:image/png;base64," + Base64.getMimeEncoder().encodeToString(testImg)));
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
        randomNum = ThreadLocalRandom.current().nextInt(1000000, 10000000);
        apartment.setDescription("Oto apartament abc" + randomNum);
        return apartmentService.createApartment(apartment);
    }

    public Agreement createAgreement(String name, Apartment apartment, User owner,
                                     LocalDate signDate, LocalDate expiryDate,
                                     User tenant, String ownerAccountNo, AgreementStatus agreementStatus){
        Agreement agreement = new Agreement();
        agreement.setName(name);
        int randomNum = ThreadLocalRandom.current().nextInt(100000, 400000 + 1);
        agreement.setMonthlyPayment(randomNum/100.);
        randomNum = ThreadLocalRandom.current().nextInt(30000, 150000 + 1);
        agreement.setAdministrationFee(randomNum/100.);
        agreement.setOwner(owner);
        agreement.setApartment(apartment);
        agreement.setTenant(tenant);
        agreement.setSigningDate(signDate);
        agreement.setExpirationDate(expiryDate);
        agreement.setOwnerAccountNo(ownerAccountNo);
        agreement.setAgreementStatus(agreementStatus);
        return agreementService.createDemoAgreement(agreement);
    }
}

