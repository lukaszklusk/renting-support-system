package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.service.ApartmentService;
import pl.edu.agh.student.rentsys.service.NotificationService;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.UserService;

import java.util.List;
import java.util.Optional;

public class NotificationsController {

    private final NotificationService service;
    private final UserService userService;
    private final ApartmentService apartmentService;

    public NotificationsController(NotificationService service, UserService userService, ApartmentService apartmentService) {
        this.service = service;
        this.userService = userService;
        this.apartmentService = apartmentService;
    }

    @GetMapping("/notifications/{id}")
    public ResponseEntity<Notification> getMessage(@PathVariable long id){
        Optional<Notification> notificationOptional = service.getNotificationById(id);
        return notificationOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/notifications/received")
    public ResponseEntity<List<Notification>> getReceivedMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(service.getReceivedNotifications(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/notifications/sent")
    public ResponseEntity<List<Notification>> getSentMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(service.getSentNotifications(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/notifications/received/{type}")
    public ResponseEntity<List<Notification>> getReceivedMessagesWithType(@PathVariable String username,
                                                                          @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                NotificationType notificationType = NotificationType.valueOf(type);
                return ResponseEntity.ok(service.getReceivedNotificationsWithType(
                        userOptional.get(), notificationType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{username}/notifications/sent/{type}")
    public ResponseEntity<List<Notification>> getSentMessagesWithType(@PathVariable String username,
                                                                      @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                NotificationType notificationType = NotificationType.valueOf(type);
                return ResponseEntity.ok(service.getSentNotificationsWithType(
                        userOptional.get(), notificationType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }

//    @PostMapping("/messages")
//    public ResponseEntity<Notification> postMessage(@RequestBody Map<String,Object> payload){
//        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
//                !payload.containsKey("topic") || !payload.containsKey("sendTime") ||
//                !payload.containsKey("messageType") || !payload.containsKey("messageBody") ||
//                !payload.containsKey("priority")){
//            return ResponseEntity.badRequest().build();
//        }
//        try {
//            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
//            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
//            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
//            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
//            String topic = (String) payload.get("topic");
//            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
//                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//            NotificationType notificationType = NotificationType.valueOf((String) payload.get("messageType"));
//            String body = (String) payload.get("messageBody");
//            NotificationPriority priority = NotificationPriority.valueOf((String) payload.get("priority"));
//            Notification notification = service.create(
//                    senderOptional.get(), receiverOptional.get(),
//                    topic, sendTime, notificationType, body, priority);
//            if(notification != null){
//                return ResponseEntity.ok(notification);
//            }else return ResponseEntity.badRequest().build();
//        }catch (DateTimeParseException | IllegalArgumentException e){
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @PostMapping("/notifications/{id}")
//    public ResponseEntity<Notification> postMessageAsResponse(@PathVariable long id,
//                                                         @RequestBody Map<String, Object> payload){
//        if(!payload.containsKey("sender") || !payload.containsKey("receiver") ||
//                !payload.containsKey("topic") || !payload.containsKey("sendTime") ||
//                !payload.containsKey("messageType") || !payload.containsKey("messageBody") ||
//                !payload.containsKey("priority")){
//            return ResponseEntity.badRequest().build();
//        }
//        Optional<Notification> replyOptional = service.getById(id);
//        if(replyOptional.isEmpty()) return ResponseEntity.notFound().build();
//        try {
//            Optional<User> senderOptional = userService.getUserByUsername((String) payload.get("sender"));
//            if (senderOptional.isEmpty()) return ResponseEntity.notFound().build();
//            Optional<User> receiverOptional = userService.getUserByUsername((String) payload.get("receiver"));
//            if (receiverOptional.isEmpty()) return ResponseEntity.notFound().build();
//            String topic = (String) payload.get("topic");
//            LocalDateTime sendTime = LocalDateTime.parse((String) payload.get("sendTime"),
//                    DateTimeFormatter.ISO_LOCAL_DATE_TIME);
//            NotificationType notificationType = NotificationType.valueOf((String) payload.get("messageType"));
//            String body = (String) payload.get("messageBody");
//            NotificationPriority priority = NotificationPriority.valueOf((String) payload.get("priority"));
//            Notification notification = service.createWithResponse(senderOptional.get(),
//                    receiverOptional.get(), topic, sendTime, notificationType, body, priority, replyOptional.get());
//            if(notification != null){
//                return ResponseEntity.ok(notification);
//            }else return ResponseEntity.badRequest().build();
//        }catch (DateTimeParseException | IllegalArgumentException e){
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    @PatchMapping("/notifications/{id}")
//    public ResponseEntity<Notification> setMessageAsRead(@PathVariable long id,
//                                                    @RequestParam String status){
//        Optional<Notification> messageOptional = service.getById(id);
//        if(messageOptional.isPresent()){
//            if(status.equals("read"))
//                return ResponseEntity.ok(service.markAsRead(messageOptional.get()));
//            else if(status.equals("unread"))
//                return ResponseEntity.ok(service.markAsUnread(messageOptional.get()));
//            else
//                return ResponseEntity.badRequest().build();
//        } else return ResponseEntity.notFound().build();
//    }
//
//    @DeleteMapping("/notifications/{id}")
//    public ResponseEntity<Notification> deleteMessage(@PathVariable long id){
//        Optional<Notification> messageOptional = service.getById(id);
//        if(messageOptional.isPresent()){
//            service.delete(messageOptional.get());
//            return ResponseEntity.ok(messageOptional.get());
//        }else return ResponseEntity.notFound().build();
//    }
//
//    @PostMapping("/user/{username}/apartment/{aid}/equipment/{eqid}")
//    public ResponseEntity<Notification> createIssue(@PathVariable String username,
//                                                    @PathVariable long aid,
//                                                    @PathVariable long eqid,
//                                                    @RequestBody Map<String,Object> payload){
//        if(!payload.containsKey("issueDescription") || !payload.containsKey("issueCreationDatetime")){
//            return ResponseEntity.badRequest().build();
//        }
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        if(userOptional.isPresent()){
//            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
//            if(apartmentOptional.isPresent()){
//                if(!apartmentOptional.get().getEquipment().contains(new Equipment(eqid)))
//                    return ResponseEntity.notFound().build();
//                Map<Long, Equipment> equipmentMap = new HashMap<>();
//                apartmentOptional.get().getEquipment().forEach(t -> equipmentMap.put(t.getId(),t));
//                Equipment eq = equipmentMap.get(eqid);
//                Notification notification = service.create(userOptional.get(),apartmentOptional.get().getOwner(),
//                        "Issue: " + eq.getName(),
//                        LocalDateTime.parse((String) payload.get("issueCreationDatetime"),DateTimeFormatter.ISO_LOCAL_DATE_TIME),
//                        NotificationType.issue, (String) payload.get("issueDescription"), NotificationPriority.important);
//                apartmentOptional.get().getEquipment().remove(eq);
//                eq.getIssues().add(notification);
//                apartmentOptional.get().getEquipment().add(eq);
//                apartmentService.changeApartment(apartmentOptional.get());
//                return ResponseEntity.ok(notification);
//            } else return ResponseEntity.notFound().build();
//        } else return ResponseEntity.notFound().build();
//    }
//
//    @DeleteMapping("/user/{username}/apartment/{aid}/equipment/{eqid}/issue/{iid}")
//    public ResponseEntity<Notification> removeIssue(@PathVariable String username,
//                                                    @PathVariable long aid,
//                                                    @PathVariable long eqid,
//                                                    @PathVariable long iid) {
//        Optional<User> userOptional = userService.getUserByUsername(username);
//        if(userOptional.isPresent()){
//            Optional<Apartment> apartmentOptional = apartmentService.getApartment(aid);
//            if(apartmentOptional.isPresent()){
//                Optional<Notification> messageOptional = service.getById(iid);
//                if(messageOptional.isPresent()) {
//                    if (!apartmentOptional.get().getEquipment().contains(new Equipment(eqid)))
//                        return ResponseEntity.notFound().build();
//                    Map<Long, Equipment> equipmentMap = new HashMap<>();
//                    apartmentOptional.get().getEquipment().forEach(t -> equipmentMap.put(t.getId(), t));
//                    Equipment eq = equipmentMap.get(eqid);
//                    apartmentOptional.get().getEquipment().remove(eq);
//                    eq.getIssues().remove(messageOptional.get());
//                    apartmentOptional.get().getEquipment().add(eq);
//                    apartmentService.changeApartment(apartmentOptional.get());
//                    return ResponseEntity.ok(messageOptional.get());
//                }else return ResponseEntity.notFound().build();
//            } else return ResponseEntity.notFound().build();
//        } else return ResponseEntity.notFound().build();
//    }
}
