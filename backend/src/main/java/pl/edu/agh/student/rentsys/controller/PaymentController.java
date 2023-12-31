package pl.edu.agh.student.rentsys.controller;

import ch.qos.logback.classic.Logger;
import lombok.AllArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.AgreementDTO;
import pl.edu.agh.student.rentsys.model.Payment;
import pl.edu.agh.student.rentsys.model.PaymentDTO;
import pl.edu.agh.student.rentsys.service.PaymentService;

import java.util.List;

@RestController
@AllArgsConstructor
public class PaymentController {

    private final Logger logger = (Logger) LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private final PaymentService paymentService;

    @GetMapping("/user/{username}/payments")
    public ResponseEntity<List<PaymentDTO>> getUserAllPayments(@PathVariable String username) {
        logger.info("GET /user/" + username + "/payments");
        List<PaymentDTO> payments = paymentService.getUserAllPayments(username);
        return ResponseEntity.ok(payments);
    }

    @PatchMapping("/user/{username}/payments/{id}")
    public ResponseEntity<PaymentDTO> payPayment(@PathVariable String username,
                                                 @PathVariable long id,
                                                 @RequestParam boolean byOwner) {
        logger.info("PATCH /user/" + username + "/payments/" + id + " --- " +
                "byOwner -> " + byOwner);
        Payment payment = paymentService.payPayment(username, id, byOwner);
        PaymentDTO paymentDTO = PaymentDTO.convertFromPayment(payment);
        return ResponseEntity.ok(paymentDTO);
    }
}
