package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.MessagePriority;
import pl.edu.agh.student.rentsys.model.MessageType;
import pl.edu.agh.student.rentsys.service.MessageService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class MessagesController {

    private final MessageService messageService;
    private final UserService userService;

    public MessagesController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<Message> getMessage(@PathVariable long id){
        Optional<Message> messageOptional = messageService.getMessageById(id);
        if(messageOptional.isPresent()) return ResponseEntity.ok(messageOptional.get());
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/messages/received")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            return ResponseEntity.ok(messageService.getReceivedMessages(userOptional.get()));
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/messages/sent")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            return ResponseEntity.ok(messageService.getReceivedMessages(userOptional.get()));
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/messages/received/{type}")
    public ResponseEntity<List<Message>> getReceivedMessagesWithType(@PathVariable String username,
                                                             @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                MessageType messageType = MessageType.valueOf(type);
                return ResponseEntity.ok(messageService.getReceivedMessagesWithType(
                        userOptional.get(), messageType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/messages/sent/{type}")
    public ResponseEntity<List<Message>> getSentMessagesWithType(@PathVariable String username,
                                                                 @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                MessageType messageType = MessageType.valueOf(type);
                return ResponseEntity.ok(messageService.getSentMessagesWithType(
                        userOptional.get(), messageType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> postMessage(@RequestBody Map<String,Object> payload){
        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
                !payload.containsKey("topic") || !payload.containsKey("sendTime") ||
                !payload.containsKey("messageType") || !payload.containsKey("messageBody") ||
                !payload.containsKey("priority")){
            return ResponseEntity.badRequest().build();
        }
        try {
            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
            String topic = (String) payload.get("topic");
            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            MessageType messageType = MessageType.valueOf((String) payload.get("messageType"));
            String body = (String) payload.get("messageBody");
            MessagePriority priority = MessagePriority.valueOf((String) payload.get("priority"));
            Message message = messageService.createMessage(senderOptional.get(), receiverOptional.get(),
                    topic, sendTime, messageType, body, priority);
            if(message != null){
                return ResponseEntity.ok(message);
            }else return ResponseEntity.badRequest().build();
        }catch (DateTimeParseException | IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/messages/{id}")
    public ResponseEntity<Message> postMessageAsResponse(@PathVariable long id,
                                                         @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
                !payload.containsKey("topic") || !payload.containsKey("sendTime") ||
                !payload.containsKey("messageType") || !payload.containsKey("messageBody") ||
                !payload.containsKey("priority")){
            return ResponseEntity.badRequest().build();
        }
        Optional<Message> replyOptional = messageService.getMessageById(id);
        if(replyOptional.isEmpty()) return ResponseEntity.notFound().build();
        try {
            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
            String topic = (String) payload.get("topic");
            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            MessageType messageType = MessageType.valueOf((String) payload.get("messageType"));
            String body = (String) payload.get("messageBody");
            MessagePriority priority = MessagePriority.valueOf((String) payload.get("priority"));
            Message message = messageService.createMessageWithResponse(senderOptional.get(),
                    receiverOptional.get(), topic, sendTime, messageType, body, priority, replyOptional.get());
            if(message != null){
                return ResponseEntity.ok(message);
            }else return ResponseEntity.badRequest().build();
        }catch (DateTimeParseException | IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/messages/{id}")
    public ResponseEntity<Message> setMessageAsRead(@PathVariable long id,
                                                    @RequestParam String status){
        Optional<Message> messageOptional = messageService.getMessageById(id);
        if(messageOptional.isPresent()){
            if(status.equals("read"))
                return ResponseEntity.ok(messageService.markAsRead(messageOptional.get()));
            else if(status.equals("unread"))
                return ResponseEntity.ok(messageService.markAsUnread(messageOptional.get()));
            else
                return ResponseEntity.badRequest().build();
        } else return ResponseEntity.notFound().build();
    }
}
