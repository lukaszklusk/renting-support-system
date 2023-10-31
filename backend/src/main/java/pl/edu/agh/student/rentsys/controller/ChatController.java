package pl.edu.agh.student.rentsys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.model.DTOMessage;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.service.MessageService;

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
    public void sendPrivateMessage(@Payload DTOMessage dtoMessage, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println(dtoMessage);
        String sessionId = headerAccessor.getSessionId();
        messageService.createMessageFromDTO(dtoMessage);
        simpMessagingTemplate.convertAndSendToUser(dtoMessage.getReceiver(),"/queue/private" , dtoMessage);
//        simpMessagingTemplate.convertAndSendToUser(dtoMessage.getReceiver(),"/private" , dtoMessage);
//        return message;

    }


    @MessageExceptionHandler(MessageConversionException.class)
    public void handleConversionException(MessageConversionException e) {
        System.out.println("MessageConversionException: " + e.getMessage());
        // Obsługa wyjątku MessageConversionException
        // Tutaj można wykonać działania w przypadku błędu konwersji wiadomości
    }

    @MessageExceptionHandler(RuntimeException.class)
    public void handleRuntimeException(RuntimeException e) {
        System.out.println("Message: " + e.getMessage());
        // Obsługa innych wyjątków
        // Tutaj można wykonać działania w przypadku innych wyjątków
    }

}
