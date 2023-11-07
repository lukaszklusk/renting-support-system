package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.Notification;
import pl.edu.agh.student.rentsys.model.NotificationType;
import pl.edu.agh.student.rentsys.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByReceiver(User user);
    List<Notification> findAllBySender(User user);
    List<Notification> findAllByReceiverAndNotificationType(User user, NotificationType type);

    List<Notification> findAllBySenderAndNotificationType(User user, NotificationType type);

    Optional<Notification> findByClientId(UUID id);
    List<Notification> findAllBySenderOrReceiver(User sender, User receiver);

}
