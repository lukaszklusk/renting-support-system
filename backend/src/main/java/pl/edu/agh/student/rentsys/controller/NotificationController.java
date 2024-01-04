package pl.edu.agh.student.rentsys.controller;

import ch.qos.logback.classic.Logger;
import lombok.AllArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.model.NotificationDTO;
import pl.edu.agh.student.rentsys.service.NotificationService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@EnableWebSocketMessageBroker
@AllArgsConstructor
public class NotificationController {

    private final Logger logger = (Logger) LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private final NotificationService notificationService;

    @GetMapping("/notifications/{id}")
    public ResponseEntity<Notification> getMessage(@PathVariable long id) {
        logger.info("GET /notifications/" + id);
        Optional<Notification> notificationOptional = notificationService.getNotificationById(id);
        return notificationOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/user/{username}/notifications/{id}/read")
    public ResponseEntity<NotificationDTO> changeNotificationReadStatus(@PathVariable String username,
                                                                        @PathVariable UUID id,
                                                                        @RequestParam Boolean read) {
        logger.info("PATCH /user/" + username + "/notifications/" + id + "/read --- " +
                "read -> " + read);
        NotificationDTO notificationDTO = notificationService.changeNotificationReadStatus(username, id, read);
        return ResponseEntity.ok(notificationDTO);
    }

    @GetMapping("/user/{username}/notifications")
    public ResponseEntity<List<NotificationDTO>> getAllMessages(@PathVariable String username) {
        logger.info("GET /user/" + username + "/notifications");
        List<NotificationDTO> notificationDTOList = notificationService.getNotifications(username);
        return ResponseEntity.ok(notificationDTOList);
    }
}
