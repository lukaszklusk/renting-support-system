package pl.edu.agh.student.rentsys.auth.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidRoleValidator implements ConstraintValidator<ValidRole, String> {
    @Override
    public boolean isValid(String role, ConstraintValidatorContext context) {
        return role != null && (role.equals("client") || role.equals("owner"));
    }
}
