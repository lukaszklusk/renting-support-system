package pl.edu.agh.student.rentsys.controller;

import ch.qos.logback.classic.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.model.MessageDTO;
import pl.edu.agh.student.rentsys.service.MessageService;

import java.util.List;
import java.util.Optional;

@Controller
@EnableWebSocketMessageBroker
public class MessageController {

    private final Logger logger = (Logger) LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload MessageDTO messageDTO) {
        logger.info("MESSAGE /chat --- message -> " + messageDTO.toString());
        messageService.createMessage(messageDTO);
        messageService.sendMessageToUser(messageDTO);
    }

    @GetMapping("/user/{username}/messages")
    public ResponseEntity<List<MessageDTO>> getUserMessages(@PathVariable String username) {
        logger.info("GET /user/" + username + "/messages");
        return ResponseEntity.ok(messageService.getMessages(username));
    }

    @GetMapping("/user/{username}/messages/received")
    public ResponseEntity<List<MessageDTO>> getUserReceivedMessages(@PathVariable String username) {
        logger.info("GET /user/" + username + "/messages/received");
        return ResponseEntity.ok(messageService.getReceivedMessages(username));
    }

    @GetMapping("/user/{username}/messages/sent")
    public ResponseEntity<List<MessageDTO>> getUserSentMessages(@PathVariable String username) {
        logger.info("GET /user/" + username + "/messages/sent");
        return ResponseEntity.ok(messageService.getSentMessages(username));
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<MessageDTO> getUserSentMessages(@PathVariable Long id) {
        logger.info("GET /messages/" + id);
        Optional<MessageDTO> optionalMessage = messageService.getDTOMessageById(id);
        return optionalMessage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
