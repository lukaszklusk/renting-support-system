package pl.edu.agh.student.rentsys.auth.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import pl.edu.agh.student.rentsys.auth.validators.ValidRoleValidator;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidRoleValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRole {
    String message() default "Invalid role";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
