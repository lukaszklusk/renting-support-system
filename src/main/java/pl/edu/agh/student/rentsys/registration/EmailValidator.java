package pl.edu.agh.student.rentsys.registration;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import org.springframework.stereotype.Service;

@Service
public class EmailValidator {
    boolean validate(String email) {
        boolean isValid = true;
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            emailAddr.validate();
        } catch (AddressException e) {
            throw new RuntimeException(e);
        }
        return isValid;

    }
}
