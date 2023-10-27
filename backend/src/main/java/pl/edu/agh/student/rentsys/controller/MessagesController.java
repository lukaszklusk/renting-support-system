package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.MessageService;
import pl.edu.agh.student.rentsys.user.User;
import pl.edu.agh.student.rentsys.user.UserService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@RestController
public class MessagesController {

    private final MessageService messageService;
    private final UserService userService;
    private final ApartmentService apartmentService;

    public MessagesController(MessageService messageService, UserService userService, ApartmentService apartmentService) {
        this.messageService = messageService;
        this.userService = userService;
        this.apartmentService = apartmentService;
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<Notification> getMessage(@PathVariable long id){
        Optional<Notification> messageOptional = messageService.getMessageById(id);
        return messageOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/messages/received")
    public ResponseEntity<List<Notification>> getReceivedMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(messageService.getReceivedMessages(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/messages/sent")
    public ResponseEntity<List<Notification>> getSentMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(messageService.getSentMessages(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/messages/received/{type}")
    public ResponseEntity<List<Notification>> getReceivedMessagesWithType(@PathVariable String username,
                                                                          @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                NotificationType notificationType = NotificationType.valueOf(type);
                return ResponseEntity.ok(messageService.getReceivedMessagesWithType(
                        userOptional.get(), notificationType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/messages/sent/{type}")
    public ResponseEntity<List<Notification>> getSentMessagesWithType(@PathVariable String username,
                                                                      @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                NotificationType notificationType = NotificationType.valueOf(type);
                return ResponseEntity.ok(messageService.getSentMessagesWithType(
                        userOptional.get(), notificationType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @PostMapping("/messages")
    public ResponseEntity<Notification> postMessage(@RequestBody Map<String,Object> payload){
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
            NotificationType notificationType = NotificationType.valueOf((String) payload.get("messageType"));
            String body = (String) payload.get("messageBody");
            NotificationPriority priority = NotificationPriority.valueOf((String) payload.get("priority"));
            Notification notification = messageService.createMessage(senderOptional.get(), receiverOptional.get(),
                    topic, sendTime, notificationType, body, priority);
            if(notification != null){
                return ResponseEntity.ok(notification);
            }else return ResponseEntity.badRequest().build();
        }catch (DateTimeParseException | IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/messages/{id}")
    public ResponseEntity<Notification> postMessageAsResponse(@PathVariable long id,
                                                              @RequestBody Map<String, Object> payload){
        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
                !payload.containsKey("topic") || !payload.containsKey("sendTime") ||
                !payload.containsKey("messageType") || !payload.containsKey("messageBody") ||
                !payload.containsKey("priority")){
            return ResponseEntity.badRequest().build();
        }
        Optional<Notification> replyOptional = messageService.getMessageById(id);
        if(replyOptional.isEmpty()) return ResponseEntity.notFound().build();
        try {
            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
            String topic = (String) payload.get("topic");
            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            NotificationType notificationType = NotificationType.valueOf((String) payload.get("messageType"));
            String body = (String) payload.get("messageBody");
            NotificationPriority priority = NotificationPriority.valueOf((String) payload.get("priority"));
            Notification notification = messageService.createMessageWithResponse(senderOptional.get(),
                    receiverOptional.get(), topic, sendTime, notificationType, body, priority, replyOptional.get());
            if(notification != null){
                return ResponseEntity.ok(notification);
            }else return ResponseEntity.badRequest().build();
        }catch (DateTimeParseException | IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/messages/{id}")
    public ResponseEntity<Notification> setMessageAsRead(@PathVariable long id,
                                                         @RequestParam String status){
        Optional<Notification> messageOptional = messageService.getMessageById(id);
        if(messageOptional.isPresent()){
            if(status.equals("read"))
                return ResponseEntity.ok(messageService.markAsRead(messageOptional.get()));
            else if(status.equals("unread"))
                return ResponseEntity.ok(messageService.markAsUnread(messageOptional.get()));
            else
                return ResponseEntity.badRequest().build();
        } else return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Notification> deleteMessage(@PathVariable long id){
        Optional<Notification> messageOptional = messageService.getMessageById(id);
        if(messageOptional.isPresent()){
            messageService.deleteMessage(messageOptional.get());
            return ResponseEntity.ok(messageOptional.get());
        }else return ResponseEntity.notFound().build();
    }

    @PostMapping("/user/{username}/apartment/{aid}/equipment/{eqid}")
    public ResponseEntity<Notification> createIssue(@PathVariable String username,
                                                    @PathVariable long aid,
                                                    @PathVariable long eqid,
                                                    @RequestBody Map<String,Object> payload){
        if(!payload.containsKey("issueDescription") || !payload.containsKey("issueCreationDatetime")){
            return ResponseEntity.badRequest().build();
        }
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()){
                if(!apartmentOptional.get().getEquipment().contains(new Equipment(eqid)))
                    return ResponseEntity.notFound().build();
                Map<Long, Equipment> equipmentMap = new HashMap<>();
                apartmentOptional.get().getEquipment().forEach(t -> equipmentMap.put(t.getId(),t));
                Equipment eq = equipmentMap.get(eqid);
                Notification notification = messageService.createMessage(userOptional.get(),apartmentOptional.get().getOwner(),
                        "Issue: " + eq.getName(),
                        LocalDateTime.parse((String) payload.get("issueCreationDatetime"),DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                        NotificationType.issue, (String) payload.get("issueDescription"), NotificationPriority.important);
                apartmentOptional.get().getEquipment().remove(eq);
                eq.getIssues().add(notification);
                apartmentOptional.get().getEquipment().add(eq);
                apartmentService.changeApartment(apartmentOptional.get());
                return ResponseEntity.ok(notification);
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/user/{username}/apartment/{aid}/equipment/{eqid}/issue/{iid}")
    public ResponseEntity<Notification> removeIssue(@PathVariable String username,
                                                    @PathVariable long aid,
                                                    @PathVariable long eqid,
                                                    @PathVariable long iid) {
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
            if(apartmentOptional.isPresent()){
                Optional<Notification> messageOptional = messageService.getMessageById(iid);
                if(messageOptional.isPresent()) {
                    if (!apartmentOptional.get().getEquipment().contains(new Equipment(eqid)))
                        return ResponseEntity.notFound().build();
                    Map<Long, Equipment> equipmentMap = new HashMap<>();
                    apartmentOptional.get().getEquipment().forEach(t -> equipmentMap.put(t.getId(), t));
                    Equipment eq = equipmentMap.get(eqid);
                    apartmentOptional.get().getEquipment().remove(eq);
                    eq.getIssues().remove(messageOptional.get());
                    apartmentOptional.get().getEquipment().add(eq);
                    apartmentService.changeApartment(apartmentOptional.get());
                    return ResponseEntity.ok(messageOptional.get());
                }else return ResponseEntity.notFound().build();
            } else return ResponseEntity.notFound().build();
        } else return ResponseEntity.notFound().build();
    }
}
