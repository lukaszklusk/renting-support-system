//package pl.edu.agh.student.rentsys.controller;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import pl.edu.agh.student.rentsys.model.*;
//import pl.edu.agh.student.rentsys.service.ApartmentService;
//import pl.edu.agh.student.rentsys.service.MessageService;
//import pl.edu.agh.student.rentsys.user.User;
//import pl.edu.agh.student.rentsys.user.UserService;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.time.format.DateTimeParseException;
//import java.util.*;
//
//@RestController
//public class MessagesController {
//
//    private final MessageService service;
//    private final UserService userService;
//    private final ApartmentService apartmentService;
//
//    public MessagesController(MessageService service, UserService userService, ApartmentService apartmentService) {
//        this.service = service;
//        this.userService = userService;
//        this.apartmentService = apartmentService;
//    }
//
//    @GetMapping("/messages/{id}")
//    public ResponseEntity<Message> getMessage(@PathVariable long id){
//        Optional<Message> messageOptional = service.getMessageById(id);
//        return messageOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/user/{username}/messages/received")
//    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String username){
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        return userOptional.map(user -> ResponseEntity.ok(service.getReceivedMessages(user))).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/user/{username}/messages/sent")
//    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String username){
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        return userOptional.map(user -> ResponseEntity.ok(service.getSentMessages(user))).orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//
//    @PostMapping("/messages")
//    public ResponseEntity<Message> postMessage(@RequestBody Map<String,Object> payload){
//        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
//                !payload.containsKey("sendTime") || !payload.containsKey("isRead") ||
//                !payload.containsKey("content")){
//            return ResponseEntity.badRequest().build();
//        }
//        try {
//            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
//            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
//            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
//            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
//
//            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
//                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//            String content = (String) payload.get("content");
//            Message message = service.createMessage(senderOptional.get(), receiverOptional.get(), content, sendTime);
//            return ResponseEntity.ok(message);
//        }catch (DateTimeParseException | IllegalArgumentException e){
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @PatchMapping("/messages/{id}")
//    public ResponseEntity<Message> setMessageAsRead(@PathVariable long id,
//                                                         @RequestParam Boolean isRead){
//        Optional<Message> messageOptional = service.getMessageById(id);
//        if(messageOptional.isPresent()){
//            if(isRead.equals(true))
//                return ResponseEntity.ok(service.markMessageAsRead(messageOptional.get()));
//            else if(isRead.equals(false))
//                return ResponseEntity.ok(service.markMessageAsUnread(messageOptional.get()));
//            else
//                return ResponseEntity.badRequest().build();
//        } else return ResponseEntity.notFound().build();
//    }
//
//    @DeleteMapping("/messages/{id}")
//    public ResponseEntity<Message> deleteMessage(@PathVariable long id){
//        Optional<Message> messageOptional = service.getMessageById(id);
//        if(messageOptional.isPresent()){
//            service.deleteMessage(messageOptional.get());
//            return ResponseEntity.ok(messageOptional.get());
//        }else return ResponseEntity.notFound().build();
//    }
//
//}
