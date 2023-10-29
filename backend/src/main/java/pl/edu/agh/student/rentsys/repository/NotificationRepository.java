package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.model.NotificationType;
import pl.edu.agh.student.rentsys.user.User;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByMessageReceiver(User user);
    List<Notification> findAllByMessageSender(User user);
    List<Notification> findAllByMessageReceiverAndNotificationType(User user, NotificationType type);

    List<Notification> findAllByMessageSenderAndNotificationType(User user, NotificationType type);

}
