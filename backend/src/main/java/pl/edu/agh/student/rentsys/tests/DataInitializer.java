package pl.edu.agh.student.rentsys.tests;
import ch.qos.logback.classic.Logger;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.security.UserRole;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.MessageService;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.repository.UserRepository;
import pl.edu.agh.student.rentsys.service.PaymentService;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;


@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final Logger logger = (Logger)LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ApartmentService apartmentService;
    private final PasswordEncoder passwordEncoder;
    private final AgreementService agreementService;
    private final MessageService messageService;
    private final PaymentService paymentService;

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
        createUser("client4@mail.com", "client4", "client4", UserRole.CLIENT,
                "Jan", "Janowski", "+48111222333");
        createUser("client5@mail.com", "client5", "client5", UserRole.CLIENT,
                "Iwan", "Groźny", "+48111222333");
        User owner = createUser("owner@mail.com", "owner", "owner", UserRole.OWNER,
                "Adam", "Mickiewicz", "+48774623921");
        createUser("admin@mail.com", "admin", "admin", UserRole.ADMIN,
                "Admin", "Admiński", "+48666420123");
        Apartment apartment = createRandApartment("Apartment 1", "ul. Abc 15",
                "Kraków", "30-349",
                50.017741,19.953718,owner, client, LocalDate.of(2019, 1, 1));

        Apartment apartment2 = createRandApartment("Apartment 2", "ul. Dde 49",
                "Kraków", "30-349",
                50.077285,19.872920,owner, null, LocalDate.of(2023, 12, 1));

        Agreement agr = createAgreement("Agreement 1", apartment, owner,
                LocalDate.of(2023,3, 13),
                LocalDate.of(2026, 3,1),
                client, "PL84109024029425764271319137", AgreementStatus.active);

        createAgreement("Agreement 2", apartment, owner,
                LocalDate.of(2021,3, 13),
                LocalDate.of(2022, 3,1),
                client3, "PL84109024029425764271319137", AgreementStatus.finished);

        createAgreement("Agreement 3", apartment, owner,
                LocalDate.of(2019,3, 13),
                LocalDate.of(2020, 3,1),
                client2, "PL84109024029425764271319137", AgreementStatus.finished);

        Agreement agr2 = createAgreement("Agreement 72", apartment2, owner,
                LocalDate.of(2023,7, 15),
                LocalDate.of(2024, 7,15),
                client3, "PL84109024029425764271319137", AgreementStatus.proposed);

        createAgreement("Agreement 75", apartment2, owner,
                LocalDate.of(2023,7, 15),
                LocalDate.of(2024, 7,15),
                client2, "PL84109024029425764271319137", AgreementStatus.proposed);


        MessageDTO messageDTO1 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("owner")
                .receiver("client")
                .content("Hello")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 20, 23, 50)).getTime())
                .build();

        MessageDTO messageDTO2 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("client")
                .receiver("owner")
                .content("Hello")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 20, 25, 50)).getTime())
                .build();

        MessageDTO messageDTO3 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("client")
                .receiver("owner")
                .content("yy?")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 21, 25, 50)).getTime())
                .build();

        MessageDTO messageDTO4 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("client")
                .receiver("owner")
                .content("yy?")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 22, 25, 50)).getTime())
                .build();

        MessageDTO messageDTO5 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("owner")
                .receiver("client")
                .content("ok")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 22, 35, 50)).getTime())
                .build();

        MessageDTO messageDTO6 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("owner")
                .receiver("client3")
                .content("?")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 22, 35, 50)).getTime())
                .build();

        MessageDTO messageDTO7 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("client3")
                .receiver("owner")
                .content("?")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 23, 35, 50)).getTime())
                .build();

        MessageDTO messageDTO8 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("client3")
                .receiver("owner")
                .content("??")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 23, 40, 50)).getTime())
                .build();

        MessageDTO messageDTO9 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("owner")
                .receiver("client2")
                .content("?")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 23, 35, 50)).getTime())
                .build();

        MessageDTO messageDTO10 = MessageDTO.builder()
                .id(UUID.randomUUID())
                .sender("owner")
                .receiver("owner")
                .content("test")
                .sendTimestamp(Timestamp.valueOf(LocalDateTime.of(2023, 10, 31, 17, 23, 35, 50)).getTime())
                .build();

        messageService.createMessage(messageDTO1);
        messageService.createMessage(messageDTO2);
        messageService.createMessage(messageDTO3);
        messageService.createMessage(messageDTO4);
        messageService.createMessage(messageDTO5);
        messageService.createMessage(messageDTO6);
        messageService.createMessage(messageDTO7);
        messageService.createMessage(messageDTO8);
        messageService.createMessage(messageDTO9);
        messageService.createMessage(messageDTO10);


        Payment payment1 = Payment.builder()
                .paymentMethod(PaymentMethod.card)
                .startDate(LocalDate.of(2023, 10,14))
                .endDate(LocalDate.of(2023, 11,13))
                .dueDate(LocalDate.of(2023, 11,14))
                .paidDate(LocalDate.of(2023, 11,16))
                .status(PaymentStatus.paid_late)
                .agreement(agr)
                .amount(1500.0)
                .build();

        Payment payment2 = Payment.builder()
                .paymentMethod(PaymentMethod.card)
                .startDate(LocalDate.of(2023, 11,14))
                .endDate(LocalDate.of(2023, 12,13))
                .dueDate(LocalDate.of(2023, 12,16))
                .paidDate(LocalDate.of(2023, 12,15))
                .status(PaymentStatus.paid)
                .agreement(agr)
                .amount(1300.0)
                .build();

//        Payment payment3 = Payment.builder()
//                .paymentMethod(PaymentMethod.card)
//                .dueDate(LocalDate.of(2024, 12,15))
//                .status(PaymentStatus.due)
//                .agreement(agr)
//                .amount(1700.0)
//                .build();
//
//        Payment payment4 = Payment.builder()
//                .paymentMethod(PaymentMethod.card)
//                .dueDate(LocalDate.of(2024, 12,15))
//                .status(PaymentStatus.overdue)
//                .agreement(agr2)
//                .amount(1900.0)
//                .build();

        paymentService.createPayment(payment1);
        paymentService.createPayment(payment2);
//        paymentService.createPayment(payment3);
//        paymentService.createPayment(payment4);

        System.out.println("----- FINISHED DATA INITIALIZATION -----");
        logger.info("Finished data initialization");

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
                                     User owner, User client, LocalDate creationDate) throws IOException {
        Apartment apartment = new Apartment();
        Set<ApartmentProperty> properties = new HashSet<>();
        int randomNum = ThreadLocalRandom.current().nextInt(300, 600 + 1);
        apartment.setSize(randomNum/10.);
        apartment.setCity(city);
        apartment.setPostalCode(postalCode);
        randomNum = ThreadLocalRandom.current().nextInt(100000, 1000000 + 1);
        properties.add(ApartmentProperty.builder()
                        .name("Price")
                        .valueType("pln")
                        .value(Integer.toString(randomNum))
                .build());


        apartment.setProperties(properties);
        Set<Picture> pictures = new HashSet<>();
        byte[] testImg1 = Objects.requireNonNull(this.getClass().getResourceAsStream("/img1.png")).readAllBytes();
        byte[] testImg2 = Objects.requireNonNull(this.getClass().getResourceAsStream("/img2.png")).readAllBytes();
        pictures.add(Picture.builder()
                        .name("Picture 1")
                        .imageData(testImg1)
                .build());
        pictures.add(Picture.builder()
                .name("Picture 2")
                .imageData(testImg2)
                .build());

        apartment.setPictures(pictures);
        Set<Equipment> equipment = new HashSet<>();
        equipment.add(Equipment.builder()
                        .name("Fridge")
                        .description("SAMSUNG RB38T774DB1 EF No frost 203cm")
                        .notifications(new HashSet<>())
//                        .apartment(apartment)
                        .isBroken(false)
                .build());
        equipment.add(Equipment.builder()
                .name("Chair")
                .description("Wooden chair")
                .notifications(new HashSet<>())
//                .apartment(apartment)
                .isBroken(false)
                .build());
        apartment.setEquipment(equipment);
        apartment.setName(name);
        apartment.setCreationDate(creationDate);
        apartment.setAddress(address);
        apartment.setLatitude(latitude);
        apartment.setLongitude(longitude);
        apartment.setOwner(owner);
        apartment.setTenant(client);
        apartment.setNotifications(new HashSet<>());
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

