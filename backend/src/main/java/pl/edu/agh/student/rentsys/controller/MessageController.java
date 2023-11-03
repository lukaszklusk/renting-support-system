package pl.edu.agh.student.rentsys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.model.MessageDTO;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.service.MessageService;

import java.util.List;
import java.util.Optional;

@Controller
@EnableWebSocketMessageBroker
public class MessageController {

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
    public void sendPrivateMessage(@Payload MessageDTO messageDTO) {
        messageService.createMessageFromDTO(messageDTO);
        simpMessagingTemplate.convertAndSendToUser(messageDTO.getReceiver(),"/queue/private" , messageDTO);
    }

    @GetMapping("/user/{username}/messages")
    public ResponseEntity<List<MessageDTO>> getUserMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getMessages(username));
    }

    @GetMapping("/user/{username}/messages/received")
    public ResponseEntity<List<MessageDTO>> getUserReceivedMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getReceivedMessages(username));
    }

    @GetMapping("/user/{username}/messages/sent")
    public ResponseEntity<List<MessageDTO>> getUserSentMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getSentMessages(username));
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<MessageDTO> getUserSentMessages(@PathVariable Long id) {
        Optional<MessageDTO> optionalMessage = messageService.getDTOMessageById(id);
        return optionalMessage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
