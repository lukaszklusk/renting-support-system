package pl.edu.agh.student.rentsys.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

@ControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(value = {UsernameNotFoundException.class})
    public ResponseEntity<AppException> handleBadRequestException(Exception e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        AppException appException = AppException.builder()
                .message(e.getMessage())
                .httpStatus(status)
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(appException, status);
    }

    @ExceptionHandler(value = {BadCredentialsException.class})
    public ResponseEntity<AppException> handleUnauthorizedException(Exception e) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        AppException appException = AppException.builder()
                .message(e.getMessage())
                .httpStatus(status)
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(appException, status);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<AppException> handleInternalServerErrorException(Exception e) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        AppException appException = AppException.builder()
                .message(e.getMessage())
                .httpStatus(status)
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(appException, status);
    }

}
