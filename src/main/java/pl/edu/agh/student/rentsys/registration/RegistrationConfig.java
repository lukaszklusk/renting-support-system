package pl.edu.agh.student.rentsys.registration;

import org.springframework.context.annotation.Configuration;

@Configuration
public class RegistrationConfig {
    public static final String APP_EMAIL = "rentsys@mail.com";
    public static final String CONFIRMATION_EMAIL_SUBJECT = "Account Activation";
    public static final int ACTIVATION_TOKEN_VALID_TIME_IN_MINUTES = 15;

    public static String buildActivationLink(String token) {
        return String.format("http://localhost:8080/registration/confirm?token=%s", token);
    }
    public static String buildEmailBody(String username, String link) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Account Activation</title>
            </head>
            <body>
                <p>Dear %s,</p>
                <p>Thank you for registering with our application. To activate your account, please click the link below:</p>
                <p><a href=%s>Activate Account</a></p>
                <p>If you did not request this registration, please ignore this email.</p>
                <p>Thank you,</p>
                <p>Your RentSys Team</p>
            </body>
            </html>""",
                username, link);
    }
}
