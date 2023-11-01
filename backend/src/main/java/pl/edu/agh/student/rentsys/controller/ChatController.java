package pl.edu.agh.student.rentsys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.model.Apartment;
import pl.edu.agh.student.rentsys.model.DTOMessage;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.service.MessageService;

import java.util.List;
import java.util.Optional;

@Controller
@EnableWebSocketMessageBroker
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;
    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message sendMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload DTOMessage dtoMessage) {
        messageService.createMessageFromDTO(dtoMessage);
        simpMessagingTemplate.convertAndSendToUser(dtoMessage.getReceiver(),"/queue/private" , dtoMessage);
    }

    @GetMapping("/user/{username}/messages")
    public ResponseEntity<List<DTOMessage>> getUserMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getMessages(username));
    }

    @GetMapping("/user/{username}/messages/received")
    public ResponseEntity<List<DTOMessage>> getUserReceivedMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getReceivedMessages(username));
    }

    @GetMapping("/user/{username}/messages/sent")
    public ResponseEntity<List<DTOMessage>> getUserSentMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getSentMessages(username));
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<DTOMessage> getUserSentMessages(@PathVariable Long id) {
        Optional<DTOMessage> optionalMessage = messageService.getDTOMessageById(id);
        return optionalMessage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
