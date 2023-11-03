package pl.edu.agh.student.rentsys.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import pl.edu.agh.student.rentsys.security.UserRole;

import java.util.Base64;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String userRole;
    private String firstName;
    private String lastName;
    private String phoneNumber;

    public static UserDTO convertFromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .userRole(user.getUserRole().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
