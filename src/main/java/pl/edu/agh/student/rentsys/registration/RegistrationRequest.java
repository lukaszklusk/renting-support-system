package pl.edu.agh.student.rentsys.registration;

public record RegistrationRequest(String username,
                                  String email,
                                  String password) {
}
