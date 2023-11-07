package pl.edu.agh.student.rentsys.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.exceptions.EntityNotFoundException;
import pl.edu.agh.student.rentsys.model.*;
import pl.edu.agh.student.rentsys.service.NotificationService;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@EnableWebSocketMessageBroker
@AllArgsConstructor
public class NotificationController {
    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private final UserService userService;

    @GetMapping("/notifications/{id}")
    public ResponseEntity<Notification> getMessage(@PathVariable long id){
        Optional<Notification> notificationOptional = notificationService.getNotificationById(id);
        return notificationOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/user/{username}/notifications/{id}/read")
    public ResponseEntity<NotificationDTO> changeNotificationReadStatus(@PathVariable String username,
                                                                        @PathVariable UUID id,
                                                                        @RequestParam Boolean read){
        try {
            NotificationDTO notificationDTO = notificationService.changeNotificationReadStatus(username, id, read);
            return ResponseEntity.ok(notificationDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{username}/notifications")
    public ResponseEntity<List<NotificationDTO>> getAllMessages(@PathVariable String username){
        try {
            List<NotificationDTO> notificationDTOList = notificationService.getNotifications(username);
            return ResponseEntity.ok(notificationDTOList);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{username}/notifications/received")
    public ResponseEntity<List<Notification>> getReceivedMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(notificationService.getReceivedNotifications(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/notifications/sent")
    public ResponseEntity<List<Notification>> getSentMessages(@PathVariable String username){
        Optional<User> userOptional = userService.getUserByUsername(username);
        return userOptional.map(user -> ResponseEntity.ok(notificationService.getSentNotifications(user))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{username}/notifications/received/{type}")
    public ResponseEntity<List<Notification>> getReceivedMessagesWithType(@PathVariable String username,
                                                                          @PathVariable String type){
        Optional<User> userOptional = userService.getUserByUsername(username);
        if(userOptional.isPresent()){
            try{
                NotificationType notificationType = NotificationType.valueOf(type);
                return ResponseEntity.ok(notificationService.getReceivedNotificationsWithType(
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
                return ResponseEntity.ok(notificationService.getSentNotificationsWithType(
                        userOptional.get(), notificationType));
            }catch (IllegalArgumentException e){
                return ResponseEntity.badRequest().build();
            }
        } else return ResponseEntity.notFound().build();
    }
}
